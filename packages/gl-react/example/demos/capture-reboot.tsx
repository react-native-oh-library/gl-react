/**
 * MIT License
 *
 * Copyright (C) 2026 Huawei Device Co., Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * capture 像素读回 + rebootForDebug 上下文重建验证（每步独立按钮，逐项判定）：
 *  - Surface#capture()：全画布 readPixels（委托 root Node）
 *  - Surface#capture(x,y,w,h)：区域读回（左半绿 / 右半蓝）
 *  - Node#capture()：root 全画布 + 64×64 离屏子 Node FBO
 *  - Surface#rebootForDebug()：在独立极简单 Node Surface 上销毁重建，3s 后复验 capture
 *
 * 画面：左半显示 64×64 离屏子 Node 纹理（纯绿 0,204,0），右半纯蓝 (0,0,255)。
 * 预期：全画布 avg≈(0,102,128)，左半≈(0,204,0)，右半≈(0,0,255)，
 * 离屏子 Node 读回 64×64 全绿。颜色容差 ±24。
 */
import React, {useCallback, useRef, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Surface} from 'gl-react-native';
import {Node, GLSL} from 'gl-react';

const greenFrag = GLSL`
precision highp float;
varying vec2 uv;
void main() {
  gl_FragColor = vec4(0.0, 0.8, 0.0, 1.0);
}`;

const splitFrag = GLSL`
precision highp float;
varying vec2 uv;
uniform sampler2D t;
void main() {
  if (uv.x < 0.5) {
    gl_FragColor = texture2D(t, vec2(uv.x * 2.0, uv.y));
  } else {
    gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
  }
}`;

// reboot 专用：单 Node、无 child、无 uniforms —— reboot 重挂后不存在
// "第一个挂载的 Node 为 root"顺序问题（多 Node 树 remount 时挂载顺序可能颠倒，
// child 抢先成为 root → root 不可被采样 → getGLOutput invariant）
const blueFrag = GLSL`
precision highp float;
varying vec2 uv;
void main() {
  gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
}`;

// ndarray → 平均色；stride 抽样加速（全画布 3.8M 字节）
function avgColor(nd: any, stride = 4): number[] {
  const {data} = nd;
  let r = 0;
  let g = 0;
  let b = 0;
  let n = 0;
  for (let i = 0; i < data.length; i += 4 * stride) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
    n++;
  }
  return n ? [Math.round(r / n), Math.round(g / n), Math.round(b / n)] : [0, 0, 0];
}

const close = (v: number, target: number, tol = 24) => Math.abs(v - target) <= tol;
const rgb = (c: number[]) => `rgb(${c[0]},${c[1]},${c[2]})`;
const isGreen = (c: number[]) => close(c[1], 204) && c[0] < 60 && c[2] < 60;
const isBlue = (c: number[]) => close(c[2], 255) && c[0] < 60 && c[1] < 60;

export function CaptureRebootDemo() {
  const surfaceRef = useRef<any>(null);
  const rootRef = useRef<any>(null);
  const rebootSurfRef = useRef<any>(null);
  const [childNode, setChildNode] = useState<any>(null);
  const [lines, setLines] = useState<string[]>(['逐个点按钮验证']);

  const append = useCallback((...ls: string[]) => {
    setLines(prev => [...prev, ...ls]);
  }, []);

  // 每个按钮独立的同步执行壳：任何异常都落到状态行，绝不中断其它步骤
  const step = useCallback(
    (name: string, fn: () => string) => {
      try {
        append(`${name}: ${fn()}`);
      } catch (e: any) {
        append(`${name}: 失败 ${e?.message || String(e)}`.slice(0, 100));
      }
    },
    [append],
  );

  const sCaptureFull = useCallback(() => {
    const s: any = surfaceRef.current;
    const nd = s.capture();
    const a = avgColor(nd);
    return `${nd.shape[1]}x${nd.shape[0]} avg=${rgb(a)} ${
      close(a[1], 102) && close(a[2], 128) ? 'PASS' : 'FAIL'
    }`;
  }, []);

  const sCaptureHalf = useCallback((side: 'L' | 'R') => {
    const s: any = surfaceRef.current;
    const [w, h] = s.getGLSize();
    const halfW = Math.floor(w / 2);
    const args: [number, number, number, number] =
      side === 'L' ? [0, 0, halfW, h] : [halfW, 0, w - halfW, h];
    const nd = s.capture(...args);
    const a = avgColor(nd);
    const pass = side === 'L' ? isGreen(a) : isBlue(a);
    return `capture(${args.join(',')}) ${nd.shape[1]}x${nd.shape[0]} avg=${rgb(a)} ${
      pass ? `PASS(${side === 'L' ? '绿' : '蓝'})` : 'FAIL'
    }`;
  }, []);

  const nCaptureRoot = useCallback(() => {
    const nd = rootRef.current.capture();
    const a = avgColor(nd);
    return `${nd.shape[1]}x${nd.shape[0]} avg=${rgb(a)} ${
      close(a[1], 102) && close(a[2], 128) ? 'PASS' : 'FAIL'
    }`;
  }, []);

  const nCaptureChild = useCallback(() => {
    if (!childNode) throw new Error('child Node 未挂载');
    const nd = childNode.capture();
    const a = avgColor(nd, 1);
    const pass = nd.shape[0] === 64 && nd.shape[1] === 64 && isGreen(a);
    return `shape=[${nd.shape.join(',')}] avg=${rgb(a)} ${
      pass ? 'PASS(64x64全绿)' : 'FAIL'
    }`;
  }, [childNode]);

  // reboot 用独立的极简 Surface（单 Node 纯蓝）：GLView 以 key={rebootId} 重挂、
  // 上下文重建；3s 后复验 capture 仍读到全蓝即重建成功
  const reboot = useCallback(() => {
    step('rebootForDebug', () => {
      rebootSurfRef.current.rebootForDebug();
      return '已触发';
    });
    setTimeout(() => {
      step('reboot后S.capture', () => {
        const nd = rebootSurfRef.current.capture();
        const a = avgColor(nd);
        return `${nd.shape[1]}x${nd.shape[0]} avg=${rgb(a)} ${
          isBlue(a) ? 'PASS(重建成功)' : 'FAIL'
        }`;
      });
    }, 3000);
  }, [step]);

  return (
    <>
      <Surface style={styles.surface} ref={surfaceRef}>
        <Node ref={rootRef} shader={{frag: splitFrag}} uniforms={{t: childNode}}>
          <Node
            ref={(n: any) => {
              if (n && childNode !== n) setChildNode(n);
            }}
            shader={{frag: greenFrag}}
            width={64}
            height={64}
          />
        </Node>
      </Surface>
      <Text style={styles.note}>左半：64×64 离屏子 Node 纹理（绿）；右半：纯蓝</Text>
      <Text style={styles.note}>下方小 Surface（reboot 验证用，纯蓝）：</Text>
      <Surface style={styles.surfaceB} ref={rebootSurfRef}>
        <Node shader={{frag: blueFrag}} />
      </Surface>
      <View style={styles.buttonRow}>
        <Text onPress={() => step('S.capture()', sCaptureFull)} style={styles.button}>
          S 全画布
        </Text>
        <Text
          onPress={() => step('S左半', () => sCaptureHalf('L'))}
          style={styles.button}>
          S 左半
        </Text>
        <Text
          onPress={() => step('S右半', () => sCaptureHalf('R'))}
          style={styles.button}>
          S 右半
        </Text>
        <Text onPress={() => step('N.capture(root)', nCaptureRoot)} style={styles.button}>
          N root
        </Text>
        <Text
          onPress={() => step('N.capture(child)', nCaptureChild)}
          style={styles.button}>
          N child
        </Text>
        <Text onPress={reboot} style={styles.button}>
          rebootForDebug
        </Text>
      </View>
      <Text style={styles.statusText} selectable>
        {lines.join('\n')}
      </Text>
    </>
  );
}

const styles = StyleSheet.create({
  surface: {width: 280, height: 280, alignSelf: 'center'},
  surfaceB: {width: 120, height: 120, alignSelf: 'center'},
  note: {fontSize: 11, color: '#888', marginTop: 8},
  buttonRow: {flexDirection: 'row', flexWrap: 'wrap', marginTop: 8},
  button: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 6,
    marginTop: 4,
    backgroundColor: '#2727ef',
    color: '#fff',
    borderRadius: 6,
    fontSize: 12,
    overflow: 'hidden',
  },
  statusText: {
    fontSize: 11,
    color: '#080',
    marginTop: 8,
    fontWeight: '700',
  },
});
