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
 * GLView.takeSnapshotAsync / SnapshotOptions 逐项验证：
 *  format jpeg(默认)/png/webp(降级 png) + flip + rect 裁剪 + compress。
 *  预览图为不对称内容（照片）便于判读 flip / rect。
 */
import React, {useCallback, useRef, useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {Surface} from 'gl-react-native';
import {Node, Shaders, GLSL, Uniform} from 'gl-react';

const img1 = require('../assets/img1.png');

const shaders = Shaders.create({
  fit: {
    frag: GLSL`
precision highp float;
varying vec2 uv;
uniform sampler2D t;
uniform float ratio;
void main() {
  vec2 s = vec2(1.0, 1.0);
  if (ratio > 1.0) { s = vec2(1.0, 1.0 / ratio); } else { s = vec2(ratio, 1.0); }
  vec2 p = (uv - 0.5) * s + 0.5;
  gl_FragColor = texture2D(t, p);
}`,
  },
});

type Btn = {label: string; opt: any; expect: string};

const BUTTONS: Btn[] = [
  {label: 'jpeg 默认', opt: {}, expect: 'uri 以 .jpeg 结尾'},
  {label: 'png', opt: {format: 'png'}, expect: 'uri 以 .png 结尾'},
  {
    label: 'webp（降级）',
    opt: {format: 'webp'},
    expect: 'uri 仍为 .png + hilog EXGL 警告',
  },
  {label: 'flip 翻转', opt: {format: 'png', flip: true}, expect: '预览上下颠倒'},
  {
    label: 'rect 裁剪',
    opt: {
      format: 'png',
      rect: {x: 200, y: 200, width: 400, height: 400},
    },
    expect: '预览为画面局部，尺寸约减半',
  },
  {
    label: 'compress 0.1',
    opt: {format: 'jpeg', compress: 0.1},
    expect: '导出成功（高压缩）',
  },
];

export function SnapshotOptionsDemo() {
  const surfaceRef = useRef<any>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [msg, setMsg] = useState('点按钮逐项导出，预览与状态将更新');

  const run = useCallback((btn: Btn) => {
    const s: any = surfaceRef.current;
    if (!s) {
      setMsg('Surface 未挂载');
      return;
    }
    const glView = s.glView ?? s;
    glView
      .capture(btn.opt)
      .then((shot: any) => {
        const uri = shot && (shot.uri || shot.localUri);
        if (!uri) throw new Error('no uri');
        setPreview(uri);
        setMsg(`${btn.label} → ${shot.width}x${shot.height} ${String(uri).slice(-16)}｜预期：${btn.expect}`);
      })
      .catch((e: any) => setMsg(`${btn.label} 失败: ` + (e?.message || e)));
  }, []);

  return (
    <>
      <Surface ref={surfaceRef} style={styles.surface}>
        <Node
          shader={shaders.fit}
          uniforms={{
            t: img1,
            ratio: Uniform.textureSizeRatio(img1),
          }}
        />
      </Surface>
      <View style={styles.buttonRow}>
        {BUTTONS.map(b => (
          <Text key={b.label} onPress={() => run(b)} style={styles.button}>
            {b.label}
          </Text>
        ))}
      </View>
      <Text
        style={[
          styles.statusText,
          msg.includes('失败') && {color: '#c00'},
        ]}
        selectable>
        {msg}
      </Text>
      {preview ? (
        <View style={{marginTop: 8, alignItems: 'center'}}>
          <Text style={styles.note}>快照预览：</Text>
          <Image source={{uri: preview}} style={styles.preview} resizeMode="contain" />
        </View>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  surface: {width: 300, height: 220, alignSelf: 'center'},
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
  statusText: {fontSize: 12, color: '#080', marginTop: 6, fontWeight: '700'},
  note: {fontSize: 11, color: '#888', marginTop: 4},
  preview: {
    width: 150,
    height: 150,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});
