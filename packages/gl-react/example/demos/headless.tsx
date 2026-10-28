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
 * GLView headless 上下文验证（不挂任何 Surface）：
 *  createContextAsync() → 64×64 渐变纹理挂到自建 FBO → takeSnapshotAsync(gl,
 *  {framebuffer, format:'png'}) → destroyContextAsync(gl)。
 *  预期：返回 GLSnapshot{uri:.png, width:64, height:64}，预览为左下暗右上亮渐变，
 *  destroy 返回 true。
 */
import React, {useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {GLView} from 'expo-gl';

export function HeadlessDemo() {
  const [msg, setMsg] = useState('点按钮开始 headless 上下文全链路');
  const [preview, setPreview] = useState<string | null>(null);
  const [bad, setBad] = useState(false);

  const run = async () => {
    setPreview(null);
    try {
      setMsg('createContextAsync…');
      const gl = await GLView.createContextAsync();
      if (!gl) throw new Error('createContextAsync returned null');

      // 64×64 渐变纹理
      const size = 64;
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      const pixels = new Uint8Array(size * size * 4);
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const i = (y * size + x) * 4;
          pixels[i] = x * 4;
          pixels[i + 1] = y * 4;
          pixels[i + 2] = 128;
          pixels[i + 3] = 255;
        }
      }
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        size,
        size,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        pixels,
      );
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

      // 自建 FBO 挂纹理，takeSnapshotAsync 指定 framebuffer 读取
      const fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        tex,
        0,
      );
      gl.viewport(0, 0, size, size);

      // headless 上下文没有渲染循环，EXGL 的命令批不会自动提交到 GL 线程；
      // 不 flush 的话 objects 表里查不到 fbo → E_GL_NO_FRAMEBUFFER
      gl.flushEXP();

      setMsg('takeSnapshotAsync(framebuffer)…');
      const shot = await GLView.takeSnapshotAsync(gl, {
        framebuffer: fbo,
        format: 'png',
      });
      const uri = shot && (shot.uri || shot.localUri);
      if (!uri) throw new Error('no uri: ' + JSON.stringify(shot).slice(0, 80));
      setPreview(String(uri));
      setBad(false);

      setMsg(
        `snapshot ok: ${shot.width}x${shot.height} uri=${String(uri).slice(
          -14,
        )}；destroyContextAsync…`,
      );
      const destroyed = await GLView.destroyContextAsync(gl);
      setMsg(
        `snapshot ${shot.width}x${shot.height} uri=${String(uri).slice(
          -14,
        )}；destroy=${String(destroyed)}`,
      );
    } catch (e: any) {
      setBad(true);
      setMsg('失败: ' + (e?.message || String(e)));
    }
  };

  return (
    <>
      <View style={styles.buttonRow}>
        <Text onPress={run} style={styles.button}>
          跑 headless 全链路
        </Text>
      </View>
      <Text
        style={[styles.statusText, bad && {color: '#c00'}]}
        selectable>
        {msg}
      </Text>
      {preview ? (
        <View style={{marginTop: 8, alignItems: 'center'}}>
          <Text style={styles.note}>预览（左下暗 → 右上亮渐变）：</Text>
          <Image
            source={{uri: preview}}
            style={styles.preview}
            resizeMode="contain"
          />
        </View>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
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
  preview: {width: 140, height: 140, marginTop: 4, borderWidth: 1, borderColor: '#ddd'},
});
