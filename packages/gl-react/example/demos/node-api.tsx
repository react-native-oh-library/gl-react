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
 * Node 属性补充验证：
 *  - 内联 shader 定义：shader={{frag}} 不经 Shaders.create
 *  - ignoreUnusedUniforms：false → 多余 uniform 触发 DEV 警告（LogBox 黄牌）；
 *    true → 抑制
 *  - onDraw：绘制次数计数
 *  - clear:null vs 默认 clear：不清屏产生拖尾残影（左），默认清屏干净（右）
 */
import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Surface} from 'gl-react-native';
import {Node, GLSL} from 'gl-react';

const inlineFrag = GLSL`
precision highp float;
varying vec2 uv;
uniform float unusedExtra;
uniform vec2 pos;
uniform float unusedToo;
void main() {
  float d = 0.15;
  vec3 col = vec3(0.95, 0.35, 0.1);
  gl_FragColor = vec4(col, smoothstep(d, d - 0.06, distance(uv, pos)));
}`;

const movingDotFrag = GLSL`
precision highp float;
varying vec2 uv;
uniform vec2 pos;
void main() {
  float d = 0.12;
  gl_FragColor = vec4(0.1, 0.9, 0.3, smoothstep(d, d - 0.05, distance(uv, pos)));
}`;

function InlineIgnoreCase() {
  const [ignore, setIgnore] = useState<boolean | undefined>(false);
  const [drawCount, setDrawCount] = useState(0);
  return (
    <>
      <Surface style={styles.surfaceSmall}>
        <Node
          shader={{frag: inlineFrag}}
          uniforms={{pos: [0.5, 0.5], unusedExtra: 1, unusedToo: 2}}
          ignoreUnusedUniforms={ignore}
          onDraw={() => setDrawCount(c => c + 1)}
        />
      </Surface>
      <View style={styles.buttonRow}>
        <Text
          onPress={() => setIgnore(false)}
          style={[styles.button, ignore === false && styles.buttonActive]}>
          ignoreUnusedUniforms=false
        </Text>
        <Text
          onPress={() => setIgnore(true)}
          style={[styles.button, ignore === true && styles.buttonActive]}>
          =true
        </Text>
      </View>
      <Text style={styles.statusText} selectable>
        ignoreUnusedUniforms={String(ignore)} onDraw 次数={drawCount}
      </Text>
      <Text style={styles.note}>
        切到 false 并改动 uniform 时页面底部应出现 LogBox 黄牌
        （"uniform 'unusedExtra' is not declared"）；true 时无黄牌。
      </Text>
    </>
  );
}

function ClearNullCase({time}: {time: number}) {
  const pos = [0.5 + 0.35 * Math.cos(time / 900), 0.5 + 0.35 * Math.sin(time / 560)];
  return (
    <>
      <View style={styles.row}>
        <View style={styles.cell}>
          <Surface style={styles.surfaceHalf}>
            <Node
              shader={{frag: movingDotFrag}}
              uniforms={{pos}}
              clear={null}
              sync
            />
          </Surface>
          <Text style={styles.label}>clear=null（拖尾残影）</Text>
        </View>
        <View style={styles.cell}>
          <Surface style={styles.surfaceHalf}>
            <Node shader={{frag: movingDotFrag}} uniforms={{pos}} sync />
          </Surface>
          <Text style={styles.label}>默认 clear（干净）</Text>
        </View>
      </View>
      <Text style={styles.note}>
        左图不清屏：绿点运动后留下历史帧叠加；右图每帧清屏无残影。
      </Text>
    </>
  );
}

export function NodeApiDemo({time}: {time: number}) {
  return (
    <>
      <InlineIgnoreCase />
      <View style={{height: 16}} />
      <ClearNullCase time={time} />
    </>
  );
}

const styles = StyleSheet.create({
  surfaceSmall: {width: 280, height: 160, alignSelf: 'center'},
  surfaceHalf: {width: 150, height: 150, alignSelf: 'center'},
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
  buttonActive: {backgroundColor: '#e91e63'},
  statusText: {fontSize: 12, color: '#080', marginTop: 6, fontWeight: '700'},
  note: {fontSize: 11, color: '#888', marginTop: 4},
});
