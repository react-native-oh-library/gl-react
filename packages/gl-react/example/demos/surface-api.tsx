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
 * Surface 属性/实例方法综合验证：
 *  - preload：GL 就绪前预加载 2 张本地纹理，完成后才触发 onLoad
 *  - onLoad / onLoadError：状态文字回报
 *  - visitor：自定义 VisitorLike 计数器（onSurfaceDrawEnd / onNodeDrawEnd…）
 *  - msaaSamples：上游 iOS 专属，鸿蒙透传忽略（页面应无异常）
 *  - 实例方法：glIsAvailable() / getGLSize() / redraw() / flush() / listSurfaces()
 */
import React, {useRef, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Surface} from 'gl-react-native';
import {Node, Shaders, GLSL, listSurfaces} from 'gl-react';

const img1 = require('../assets/img1.png');
const mario = require('../assets/mario.png');

const shaders = Shaders.create({
  checker: {
    frag: GLSL`
precision highp float;
varying vec2 uv;
uniform float n;
void main() {
  vec2 g = floor(fract(uv * n) * 2.0);
  float c = mod(g.x + g.y, 2.0);
  gl_FragColor = vec4(vec3(c * 0.85 + 0.1), 1.0);
}`,
  },
});

type Counts = {
  surfaceMount: number;
  glChange: number;
  surfaceDrawEnd: number;
  nodeDrawEnd: number;
};

/** 全钩子都实现的自定义 visitor（缺方法会被直接调用而崩溃） */
function makeCounterVisitor(counts: Counts) {
  return {
    onSurfaceMount: () => void (counts.surfaceMount += 1),
    onSurfaceUnmount: () => {},
    onSurfaceGLContextChange: () => void (counts.glChange += 1),
    onSurfaceDrawStart: () => {},
    onSurfaceDrawEnd: () => void (counts.surfaceDrawEnd += 1),
    onSurfaceDrawSkipped: () => {},
    onSurfaceDrawError: () => false,
    onNodeDrawStart: () => {},
    onNodeDraw: () => {},
    onNodeDrawEnd: () => void (counts.nodeDrawEnd += 1),
    onNodeDrawSkipped: () => {},
    onNodeSyncDeps: () => {},
  };
}

export function SurfaceApiDemo() {
  const surfaceRef = useRef<any>(null);
  const countsRef = useRef<Counts>({
    surfaceMount: 0,
    glChange: 0,
    surfaceDrawEnd: 0,
    nodeDrawEnd: 0,
  });
  const visitorRef = useRef<any>(null);
  if (!visitorRef.current) {
    visitorRef.current = makeCounterVisitor(countsRef.current);
  }
  const [status, setStatus] = useState('等待 GL…（preload 2 张纹理）');
  const [tick, setTick] = useState(0);

  const readBack = () => {
    const s: any = surfaceRef.current;
    if (!s) {
      setStatus('Surface 未挂载');
      return;
    }
    const [w, h] = s.getGLSize();
    const c = countsRef.current;
    setStatus(
      `glIsAvailable=${s.glIsAvailable()} getGLSize=[${w},${h}] ` +
        `draw=${c.surfaceDrawEnd} nodeDraw=${c.nodeDrawEnd} ` +
        `mount=${c.surfaceMount} glChange=${c.glChange} ` +
        `listSurfaces=${listSurfaces().length}`,
    );
    setTick(tick + 1);
  };

  const forceRedraw = () => {
    const s: any = surfaceRef.current;
    if (s) {
      const before = countsRef.current.surfaceDrawEnd;
      s.redraw();
      s.flush(); // 立即执行，draw 计数应 +1
      const after = countsRef.current.surfaceDrawEnd;
      setStatus(`redraw()+flush() 前 draw=${before} 后 draw=${after}`);
    }
  };

  return (
    <>
      <Surface
        ref={surfaceRef}
        style={styles.surface}
        preload={[img1, mario]}
        visitor={visitorRef.current}
        msaaSamples={4}
        onLoad={() => setStatus('onLoad：GL 就绪 + preload 2 张完成')}
        onLoadError={e => setStatus('onLoadError：' + (e?.message || e))}>
        <Node shader={shaders.checker} uniforms={{n: 8}} />
      </Surface>
      <View style={styles.buttonRow}>
        <Text onPress={readBack} style={styles.button}>
          实例方法读回
        </Text>
        <Text onPress={forceRedraw} style={styles.button}>
          redraw()+flush()
        </Text>
      </View>
      <Text style={styles.statusText} selectable>
        {status}
      </Text>
      <Text style={styles.note}>
        读回 tick={tick}；msaaSamples=4 已透传（鸿蒙忽略，无异常）
      </Text>
    </>
  );
}

const styles = StyleSheet.create({
  surface: {width: 280, height: 210, alignSelf: 'center'},
  buttonRow: {flexDirection: 'row', flexWrap: 'wrap', marginTop: 8},
  button: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
    marginTop: 4,
    backgroundColor: '#2727ef',
    color: '#fff',
    borderRadius: 6,
    fontSize: 13,
    overflow: 'hidden',
  },
  statusText: {fontSize: 12, color: '#080', marginTop: 6, fontWeight: '700'},
  note: {fontSize: 11, color: '#888', marginTop: 4},
});
