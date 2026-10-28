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
 * Uniform 补充验证：
 *  - Uniform.textureSize(obj)：注入纹理像素尺寸，shader 输出颜色 = 尺寸可视化
 *    img1=512x384 → 画面 ≈ rgb(255,192)（偏亮橙）；mario=32x32 → ≈ rgb(16,16)（近黑）
 *  - Uniform.backbufferFrom(node)：B 采样 A 的上一帧 backbuffer
 *  - 弃用字符串 "Backbuffer"：功能等价，触发 DEV 弃用警告
 */
import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Surface} from 'gl-react-native';
import {Node, GLSL, Uniform} from 'gl-react';

const img1 = require('../assets/img1.png');
const mario = require('../assets/mario.png');

const sizeFrag = GLSL`
precision highp float;
varying vec2 uv;
uniform vec2 ts;
void main() {
  gl_FragColor = vec4(ts.x / 512.0, ts.y / 512.0, 0.35, 1.0);
}`;

const feedbackFrag = GLSL`
precision highp float;
varying vec2 uv;
uniform sampler2D t;
uniform float decay;
void main() {
  vec3 prev = texture2D(t, uv).rgb * decay;
  vec3 now = vec3(0.05, 0.85, 0.3) * smoothstep(0.10, 0.02, distance(uv, vec2(0.5)));
  gl_FragColor = vec4(prev + now, 1.0);
}`;

// 根节点：左右并排展示 A / B 两个离屏 Node 的输出
const combineFrag = GLSL`
precision highp float;
varying vec2 uv;
uniform sampler2D a;
uniform sampler2D b;
void main() {
  gl_FragColor = uv.x < 0.5 ? texture2D(a, uv * vec2(2.0, 1.0))
                            : texture2D(b, uv * vec2(2.0, 1.0) - vec2(1.0, 0.0));
}`;

function TextureSizeCase() {
  return (
    <>
      <View style={styles.row}>
        <View style={styles.cell}>
          <Surface style={styles.surfaceHalf}>
            <Node
              shader={{frag: sizeFrag}}
              uniforms={{ts: Uniform.textureSize(img1)}}
            />
          </Surface>
          <Text style={styles.label}>img1 512×384{'\n'}预期 rgb≈(255,192,89)</Text>
        </View>
        <View style={styles.cell}>
          <Surface style={styles.surfaceHalf}>
            <Node
              shader={{frag: sizeFrag}}
              uniforms={{ts: Uniform.textureSize(mario)}}
            />
          </Surface>
          <Text style={styles.label}>mario 32×32{'\n'}预期 rgb≈(16,16,89)</Text>
        </View>
      </View>
    </>
  );
}

function BackbufferFromCase({time}: {time: number}) {
  // A、B、根展示节点必须在同一 Surface（同一 GL 上下文）内；
  // 且 backbuffering 的 Node 不能是 root —— 第一个挂载的 Node 是 root，
  // 所以把并排展示用的 combine 放最前，A、B 作为它的 children +
  // uniforms 引用（依赖驱动绘制）。
  const [nodes, setNodes] = useState<{a: any; b: any}>({a: null, b: null});
  const [useDeprecated, setUseDeprecated] = useState(false);
  const decay = 0.88 + 0.06 * Math.sin(time / 700);
  return (
    <>
      <Surface style={styles.surface}>
        {/* 根：左右并排展示 A / B（无 backbuffering） */}
        <Node shader={{frag: combineFrag}} uniforms={{a: nodes.a, b: nodes.b}}>
          {/* A：自身 backbuffer 反馈（衰减拖尾） */}
          <Node
            ref={(n: any) => {
              if (n) {
                setNodes(p => (p.a === n ? p : {...p, a: n}));
              }
            }}
            shader={{frag: feedbackFrag}}
            width={128}
            height={128}
            backbuffering
            sync
            uniforms={{
              t: useDeprecated ? 'Backbuffer' : Uniform.Backbuffer,
              decay,
            }}
          />
          {/* B：t = backbufferFrom(A)，采样 A 的上一帧 */}
          <Node
            ref={(n: any) => {
              if (n) {
                setNodes(p => (p.b === n ? p : {...p, b: n}));
              }
            }}
            shader={{frag: feedbackFrag}}
            width={128}
            height={128}
            backbuffering
            sync
            uniforms={{
              t: nodes.a ? Uniform.backbufferFrom(nodes.a) : Uniform.Backbuffer,
              decay,
            }}
          />
        </Node>
      </Surface>
      <View style={styles.buttonRow}>
        <Text
          onPress={() => setUseDeprecated(v => !v)}
          style={styles.button}>
          切换弃用字符串 "Backbuffer"（当前 {useDeprecated ? '用' : '不用'}）
        </Text>
      </View>
      <Text style={styles.note}>
        左=A 自身反馈拖尾，右=B 经 backbufferFrom(A) 采样 A 的上一帧（内容同源、
        慢一拍）。切到弃用字符串后功能不变，页面底部出现 LogBox 弃用警告。
      </Text>
    </>
  );
}

export function UniformExtraDemo({time}: {time: number}) {
  return (
    <>
      <TextureSizeCase />
      <View style={{height: 12}} />
      <BackbufferFromCase time={time} />
    </>
  );
}

const styles = StyleSheet.create({
  surface: {width: 220, height: 160, alignSelf: 'center', marginTop: 4},
  surfaceHalf: {width: 150, height: 110, alignSelf: 'center'},
  row: {flexDirection: 'row', justifyContent: 'center'},
  cell: {marginHorizontal: 6},
  label: {fontSize: 11, color: '#555', marginTop: 4, textAlign: 'center'},
  buttonRow: {flexDirection: 'row', flexWrap: 'wrap', marginTop: 8},
  button: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginTop: 4,
    backgroundColor: '#2727ef',
    color: '#fff',
    borderRadius: 6,
    fontSize: 12,
    overflow: 'hidden',
  },
  note: {fontSize: 11, color: '#888', marginTop: 4},
});
