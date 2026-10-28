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
 * Bus 补充验证：
 *  - 纹理数组 uniform：sampler2D ts[3]，三个 <Bus uniform="ts" index={0/1/2}>
 *  - 函数式 children：(redraw) => <Node/>，回调计数显示
 */
import React, {useRef} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Surface} from 'gl-react-native';
import {Node, GLSL, Bus} from 'gl-react';

const img1 = require('../assets/img1.png');
const mario = require('../assets/mario.png');

const stripesFrag = GLSL`
precision highp float;
varying vec2 uv;
uniform sampler2D ts[3];
void main() {
  vec2 u = vec2(fract(uv.x * 3.0), uv.y);
  int band = int(floor(uv.x * 3.0));
  vec4 c0 = texture2D(ts[0], u);
  vec4 c1 = texture2D(ts[1], u);
  vec4 c2 = texture2D(ts[2], u);
  gl_FragColor = band == 0 ? c0 : (band == 1 ? c1 : c2);
}`;

const passthroughFrag = GLSL`
precision highp float;
varying vec2 uv;
uniform sampler2D t;
void main() {
  gl_FragColor = texture2D(t, uv);
}`;

const gradientFrag = GLSL`
precision highp float;
varying vec2 uv;
uniform float t;
void main() {
  gl_FragColor = vec4(uv.x, 0.3, 0.5 + 0.5 * sin(t / 400.0), 1.0);
}`;

export function BusArrayDemo({time}: {time: number}) {
  // 注意：函数式 children 在 Node render 期间被调用，不能在此期间 setState，
  // 用 ref 计数；显示值随 App 层 60fps time 重渲染更新
  const fnChildrenCalls = useRef(0);
  return (
    <>
      <Surface style={styles.surface}>
        <Node shader={{frag: stripesFrag}} uniforms={{ts: [null, null, null]}}>
          {/* index 0：静态图 require 资源 —— Bus 只认 Node，原始图片输入
              需包一层 passthrough Node 才可渲染 */}
          <Bus uniform="ts" index={0}>
            <Node shader={{frag: passthroughFrag}} uniforms={{t: img1}} />
          </Bus>
          {/* index 1：另一张静态图 */}
          <Bus uniform="ts" index={1}>
            <Node shader={{frag: passthroughFrag}} uniforms={{t: mario}} />
          </Bus>
          {/* index 2：函数式 children —— 渲染一个动画 Node */}
          <Bus uniform="ts" index={2}>
            {(redraw: any) => {
              fnChildrenCalls.current += 1;
              return <Node shader={{frag: gradientFrag}} uniforms={{t: time}} />;
            }}
          </Bus>
        </Node>
      </Surface>
      <Text style={styles.statusText} selectable>
        函数式 children 调用次数={fnChildrenCalls.current}（应随动画持续增长）
      </Text>
      <Text style={styles.note}>
        三栏预期：左=照片图、中=32×32 小图（模糊放大）、右=动画渐变。
      </Text>
    </>
  );
}

const styles = StyleSheet.create({
  surface: {width: 300, height: 160, alignSelf: 'center'},
  statusText: {fontSize: 12, color: '#080', marginTop: 6, fontWeight: '700'},
  note: {fontSize: 11, color: '#888', marginTop: 4},
});
