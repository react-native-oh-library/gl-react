> 文档模板：v0.4.2

<p align="center">
  <h1 align="center"> <code>gl-react</code> </h1>
</p>

本项目基于 [gl-react](https://github.com/gre/gl-react) 开发，为 React Native 鸿蒙（OpenHarmony）适配版本。

该三方库的鸿蒙适配版本支持直接从仓库下载 tgz 使用，版本所属关系如下：

| 三方库名称    | 三方库版本    | 发布信息     | 支持RN版本    | Autolink     | 编译API版本     | 社区基线版本    |  源码地址   |
| ------------ | ------------ | ------------------------------ | ------------- | ------------- |------------------------ | ------------- | ------------- |
| @react-native-ohos/gl-react-native | [~ 6.1.0-beta.1](https://github.com/tyBrave/gl-react/tree/master/packages/gl-react-native) | [Releases](https://github.com/tyBrave/gl-react/releases) | 0.72.* | 是 | API13+ | 6.1.0 | [br_rnoh0.72](https://github.com/tyBrave/gl-react/tree/master/packages/gl-react-native) |
| @react-native-ohos/gl-react | [~ 1.0.0-beta.1](https://github.com/tyBrave/gl-react/tree/master/packages/gl-react) | [Releases](https://github.com/tyBrave/gl-react/releases) | 0.72.* | 是 | API13+ | 6.0.0 | [br_rnoh0.72](https://github.com/tyBrave/gl-react/tree/master/packages/gl-react) |
| @react-native-ohos/expo-gl | [~ 1.0.0-beta.1](https://github.com/tyBrave/expo/tree/main/packages/expo-gl) | [Releases](https://github.com/tyBrave/expo/releases) | 0.72.* | 是 | API13+ | 58.0.3 | [main](https://github.com/tyBrave/expo/tree/main/packages/expo-gl) |

## 简介

gl-react 是一个通用的 React 库，用于编写和组合 WebGL 着色器。

鸿蒙适配版本由社区 npm 包（`gl-react`、`gl-react-native`、`gl-react-expo`）与鸿蒙适配包（`@react-native-ohos/gl-react`、`@react-native-ohos/gl-react-native`、`@react-native-ohos/expo-gl`）组成：

- `@react-native-ohos/gl-react`：gl-react 核心别名包（纯 JS，metro 经 `harmony.alias` 自动重定向），提供 `Shaders`/`GLSL`/`Node`/`Bus`/`LinearCopy`/`NearestCopy`/`Uniform`/`connectSize` 等平台无关核心 API；
- `@react-native-ohos/gl-react-native`：gl-react-native 绑定别名包（纯 JS），提供 `Surface`（经 gl-react-expo 官方绑定挂接 expo-gl）；
- `@react-native-ohos/expo-gl`：鸿蒙原生 GL 能力（JS 入口 + `harmony/expo_gl.har`），原生侧为 ExpoGLView（XComponent + EGL + GLES3），暴露 WebGL 2.0 语义子集与 `endFrameEXP` 等扩展；
- `@react-native-ohos/expo-asset` / `@react-native-ohos/expo-modules-core`：`require()` 纹理资源落沙箱与原生模块加载的适配 stub。

业务代码**零改动**：照常 `import { Surface } from "gl-react-native"`、`import { Node, Shaders, GLSL, Bus, Uniform } from "gl-react"`，metro 自动重定向到鸿蒙适配包。

## 下载安装

进入到工程目录并输入以下命令：

**npm**

```bash
npm install @react-native-ohos/gl-react-native
```

**yarn**

```bash
yarn add @react-native-ohos/gl-react-native
```

> [!TIP] 本库当前以 tgz 形式随源码仓库提供（见上方版本表“源码地址”），可将其放入工程后以 `file:` 依赖安装，与 `@react-native-ohos/gl-react`、`@react-native-ohos/expo-gl`、`@react-native-ohos/expo-asset`、`@react-native-ohos/expo-modules-core` 配套使用（对应关系见下节）；`gl-react`、`gl-react-expo` 直接使用 npm 官方版本（`^6.0.0`），无需修改。

## 依赖关系说明（如有则保留，不存在则删除）

请根据应用工程使用的 RN 框架版本，选择对应版本的三方库进行引入，版本对应关系如下：

| RN 框架版本 | 鸿蒙化依赖库 | 支持版本范围 |
| --- | --- | --- |
| 0.72 | @react-native-ohos/gl-react-native | ~6.1.0-beta.1 |
| | @react-native-ohos/gl-react | ~1.0.0-beta.1 |
| | @react-native-ohos/expo-gl | ~1.0.0-beta.1 |
| | @react-native-ohos/expo-asset | ~1.0.0-beta.1 |
| | @react-native-ohos/expo-modules-core | ~1.0.0-beta.1 |

本库鸿蒙侧实现依赖上述鸿蒙化三方库，如已在鸿蒙应用工程中引入，可跳过本章节步骤，直接使用。

> [!TIP] 请确保引入的三方库版本与应用工程的 RN 框架版本匹配，不匹配的版本可能导致编译或运行异常。

## Link

|                                      | 是否支持autolink | RN框架版本 |
|--------------------------------------|----------------|-----------|
| ~ 6.1.0-beta.1                       | Yes            |  0.72     |
| ~ 1.0.0-beta.1                       | Yes            |  0.72     |

使用AutoLink的工程需要根据该文档配置，Autolink框架指导文档：https://gitcode.com/openharmony-sig/ohos_react_native/blob/master/docs/zh-cn/Autolinking.md

如您使用的版本支持 Autolink，并且工程已接入 Autolink，可跳过ManualLink配置。
<details>
  <summary>ManualLink: 此步骤为手动配置原生依赖项的指导</summary>

首先需要使用 DevEco Studio 打开项目里的 HarmonyOS 工程 `harmony`。

原生端依赖 `@react-native-ohos/expo-gl` 的 har 包（位于该包安装路径的 `harmony` 文件夹下）。打开 `entry/oh-package.json5`，添加以下依赖：

```json
"dependencies": {
    "@react-native-ohos/expo-gl": "file:../../node_modules/@react-native-ohos/expo-gl/harmony/expo_gl.har"
  }
```

`harmony/oh-package.json5` 中按实际路径相应添加（`file:../node_modules/...`）。

> [!TIP] RNOH autolinking 会在构建时自动生成/覆盖 `entry/src/main/cpp/autolinking.cmake` 与 `RNOHPackagesFactory.h`，自动注册 ExpoGlPackage（含 ExpoGLView 组件与 ExpoGL/ExpoAsset TurboModule），**无需手工修改 CMakeLists / PackageProvider / RNPackagesFactory**。
</details>

### 运行

点击右上角的 `sync` 按钮

或者在命令行终端执行：

```bash
cd entry
ohpm install
```

然后编译、运行即可。

## 约束与限制

### 兼容性

本文档内容基于以下版本验证通过：

1. RNOH: 0.72.x（RN 0.72.5）; SDK: HarmonyOS SDK（API 13+）; IDE: DevEco Studio 5.0+ / 6.0+; ROM: HarmonyOS 6.0;

### 权限要求

使用网络纹理（`http(s)://`）时需在 `entry/src/main/module.json5` 中声明 `ohos.permission.INTERNET`（normal 级权限，无需动态申请）；纯本地渲染与快照导出免权限。

```json
"requestPermissions": [
  {
    "name": "ohos.permission.INTERNET",
  },
],
```

### 资源文件放置说明

着色器纹理如需使用 `require()` 打包在 HAP 内的本地图片资源（PNG/JPEG），该资源经 ExpoAsset 落到应用沙箱后由原生解码上传，无需额外放置到 rawfile；如使用 rawfile 资源，请将文件放置在鸿蒙工程的 `entry/src/main/resources/rawfile` 目录，并以 `resource://RAWFILE/<相对路径>` 形式引用（如 `resource://RAWFILE/assets/img1.png`）。

### 编译运行API要求（如有则保留，不存在则删除）

> [!TIP] 当前三方库所有版本均已实现版本隔离，支持在 `API13+` 工程编译，及 `API13+` ROM运行。

## 使用示例

下面的代码展示了这个库的基本使用场景：

> [!WARNING] 使用时 import 的库名不变（`gl-react-native` / `gl-react`），鸿蒙侧由 metro 自动重定向到适配包。

### 基础示例

```tsx
import React from 'react';
import {Surface} from 'gl-react-native';
import {Node, Shaders, GLSL} from 'gl-react';

const shaders = Shaders.create({
  helloBlue: {
    frag: GLSL`
precision highp float;
varying vec2 uv;
uniform float blue;
void main() {
  gl_FragColor = vec4(uv.x, uv.y, blue, 1.0);
}`,
  },
});

const HelloBlue = (props: {blue: number}) => (
  <Node shader={shaders.helloBlue} uniforms={{blue: props.blue}} />
);

export default () => (
  <Surface style={{width: 300, height: 300}}>
    <HelloBlue blue={0.8} />
  </Surface>
);
```

### 图片纹理示例

```tsx
import React from 'react';
import {Surface} from 'gl-react-native';
import {Node, Shaders, GLSL} from 'gl-react';

const shaders = Shaders.create({
  saturate: {
    frag: GLSL`
precision highp float;
varying vec2 uv;
uniform sampler2D tex;
uniform float saturation;
void main() {
  vec4 c = texture2D(tex, uv);
  float g = dot(c.rgb, vec3(0.299, 0.587, 0.114));
  gl_FragColor = vec4(mix(vec3(g), c.rgb, saturation), c.a);
}`,
  },
});

export default () => (
  <Surface style={{width: 300, height: 300}}>
    <Node
      shader={shaders.saturate}
      uniforms={{
        tex: {uri: 'https://server/path/photo.jpg'},
        saturation: 0.8,
      }}
    />
  </Surface>
);
```

> [!TIP] 图片纹理请传 URI 形态（`require()` 资源数字、`{uri}`、`http(s)://`、`file://`、`data:`），经 Image Kit / stb 解码后上传；**解码仅支持 PNG/JPEG**，不支持 WebP。

## 接口说明

> [!TIP] "Platform"列表示该属性在原三方库上支持的平台。

> [!TIP] "HarmonyOS Support"列为 **yes** 表示 OpenHarmony 平台支持该属性/接口；**no** 则表示不支持（含"上游仅 Web/iOS 专属"与"未验证"两类，后者已在描述中注明）。使用方法跨平台一致，效果对标 iOS 或 Android 的效果。

### 组件

| 名称       | 参数类型     | 必填  | 平台  | OpenHarmony平台支持 | 描述 |
|------------|------------|----------------------|------|-----|----------------|
| Surface | [SurfaceProps](#surfaceprops) | yes | all | yes | GL 渲染面组件，尺寸经 style 设置；承载 WebGL 上下文与根 Node 树 |
| Node | [NodeProps](#nodeprops) | yes | all | yes | 着色器节点组件，可嵌套组合（子 Node 输出纹理作为父 Node 的 uniform 输入） |
| Bus | [BusProps](#busprops) | No | all | yes | 纹理总线，跨多个消费者共享一份计算 |
| LinearCopy / NearestCopy | — | No | all | yes | 纹理拷贝渲染容器（线性/最近邻采样） |
| Shaders | 静态注册器 | 是 | all | yes | `Shaders.create({ name: GLSL\`...\` })` 预编译注册 shader |
| GLSL | tagged template | GLSL 源码字符串 | No | all | yes | 片元着色器模板字符串标签 |
| Uniform | 常量/工厂对象 | No | all | yes | 声明式特殊 uniform（Backbuffer、Resolution 等） |
| connectSize | 高阶组件 | 组件 | No | all | yes | 把 Surface 的 GL 尺寸注入业务组件 props（width/height） |
| createSurface | 工厂函数 | ({GLView, ...}) | Surface 组件 | No | all | yes | 平台绑定工厂（适配内部使用） |
| listSurfaces | function | / | Surface 列表 | No | all | yes | 枚举当前所有 Surface 实例（调试用） |
| Visitor / VisitorLogger / Visitors | 调试访问器 | / | / | No | all | yes | 绘制生命周期观察者 |
| Backbuffer（字符串常量） | constant | / | / | No | all | no | 旧写法，等价 `Uniform.Backbuffer`，使用会打印弃用警告（未验证） |

### 属性

**SurfaceProps**

| 名称                           | 参数类型          | 默认值       | 必填            | 平台   | HarmonyOS平台支持    | 描述 |
|------------------------------|--------------------|------------|---------------|------|------------------|---------------|
| children | ReactNode | None | yes | All | yes | GL 渲染树，须含一个可发现的根 Node（根 Node 直接绘制到 Surface 画布） |
| style | StyleProp\<ViewStyle\> | None | No | All | yes | 容器样式；宽高决定 drawingBuffer 尺寸（像素密度生效，×3.5 等） |
| preload | Array\<any\> | None | No | All | yes | GL 就绪前预加载的纹理资源（require() 资源 / {uri}），全部完成才触发 onLoad |
| onLoad | Function | None | No | All | yes | GL 上下文就绪、preload 完成、首帧绘制完成后的回调 |
| onLoadError | Function | None | No | All | yes | GL 创建/preload 失败回调，参数为 Error |
| onContextLost | Function | None | No | All | no | Web 语义事件，expo-gl 原生平台（含 iOS/Android/鸿蒙）均无此事件，永不触发 |
| onContextRestored | Function | None | No | All | no | 同上 |
| visitor | VisitorLike \| VisitorLike[] | None | No | All | yes | 挂载绘制调试访问器 |
| 其余 ViewProps | ViewProps | None | No | All | yes | 未识别的 props 原样透传给底层 GLView |

**NodeProps**

| 名称                           | 参数类型          | 默认值       | 必填            | 平台   | HarmonyOS平台支持    | 描述 |
|------------------------------|--------------------|------------|---------------|------|------------------|---------------|
| shader | ShaderIdentifier \| {frag, vert?} | None | yes | All | yes | `Shaders.create` 的键或内联定义；vert 缺省用内置全屏大三角 |
| uniforms | object | {} | No | All | yes | uniform 值：数值/数组/vec、sampler2D（require() 资源、{uri}、Node、Bus、Uniform.*） |
| uniformsOptions | object | {} | No | All | yes | 纹理 uniform 采样参数：interpolation（linear/nearest）、wrap（clamp to edge/repeat/mirrored repeat） |
| ignoreUnusedUniforms | string[] \| boolean | — | No | All | yes | 抑制"uniform 未在 shader 中声明"的警告 |
| sync | boolean | false | No | All | yes | props 更新后立即同步绘制（不等下一帧） |
| width / height | number | 继承父级 GL 尺寸 | No | All | yes | 非根节点 = 其 FBO 尺寸；根节点必须与 Surface 尺寸一致 |
| children | ReactNode | — | No | All | yes | 子 Node/Bus 组成渲染图 |
| backbuffering | boolean | false | No | All | yes | 启用 backbuffer 双 FBO（供 Uniform.Backbuffer）；挂载后不可变更；根节点不支持 |
| blendFunc | {src, dst} | 常规 alpha 混合 | No | All | yes | 混合方程；zero/one/src alpha 等全部别名可用（含 zero 守卫修复） |
| clear | {color: [r,g,b,a]} \| null | {color:[0,0,0,0]} | No | All | yes | 绘制前清屏色；null 表示不清屏（叠加合成用） |
| onDraw | Function | None | No | All | yes | 每次实际绘制后回调 |

**BusProps**

| 名称                           | 参数类型          | 默认值       | 必填            | 平台   | HarmonyOS平台支持    | 描述 |
|------------------------------|--------------------|------------|---------------|------|------------------|---------------|
| children | ReactElement \| (redraw) => ReactElement | — | yes | All | yes | 被复用的内容（Node 树等）；函数式 children 可拿 redraw |
| uniform | string | — | 否 | All | yes | 挂到父 Node 的哪个 sampler2D uniform（须在 Node 内） |
| index | number | 0 | No | All | yes | uniform 为纹理数组时的下标 |

### API

**Surface 实例方法（ref）**

| 名称     | 类型     | 参数类型 | 返回值 | 必填    | 平台 | OpenHarmony平台支持 | 描述  |
|--------|---------|-----|-------|-------|--------|-----|-----------------|
| capture | function | (x?, y?, w?, h?) | NDArray | No | All | yes | 像素读回（原生同步 readPixels）：全画布/区域均可，内部委托 root Node |
| redraw | function | / | void | No | All | yes | 标记脏，下一帧重绘 |
| flush | function | / | void | No | All | yes | 立即同步执行一次绘制 |
| glIsAvailable | function | / | boolean | No | All | yes | GL 上下文是否存活 |
| getGLSize | function | / | [w, h] | No | All | yes | drawingBuffer 尺寸；值在上下文创建时冻结，不随后续布局变化 |
| rebootForDebug | function | / | void | No | All | yes | 调试用：GLView 整体重挂、上下文销毁重建，重建后渲染/读回恢复正常。注意多 Node 树重挂时挂载顺序可能颠倒（child 抢先成为 root 会触发 invariant），复杂树慎用 |
| captureAsDataURL | function | ({format, quality}) | Promise\<string\> | No | All | no | 上游仅 Web 实现，RN 的 GLView 未实现该 API；鸿蒙侧用 GLView.takeSnapshotAsync 替代 |
| captureAsBlob | function | ({format, quality}) | Promise\<Blob\> | No | All | no | 同上 |

**Node 实例方法（ref）**

| 名称     | 类型     | 参数类型 | 返回值 | 必填    | 平台 | OpenHarmony平台支持 | 描述  |
|--------|---------|-----|-------|-------|--------|-----|-----------------|
| capture | function | (x?, y?, w?, h?) | NDArray | No | All | yes | 读本 Node 像素（readPixels）：root 全画布与离屏子 Node FBO 均可 |
| redraw / flush | function | / | void | No | All | yes | 标记脏 / 立即绘制 |
| setDrawProps | function | Partial\<Props\> | void | No | All | yes | 命令式局部更新 props |
| getGLOutput | function | / | WebGLTexture | No | All | yes | 本 Node FBO 颜色纹理（根 Node 不可用） |
| getGLBackbufferOutput | function | / | WebGLTexture | No | All | yes | backbuffer 纹理（需 backbuffering） |
| getGLSize | function | / | [w, h] | No | All | yes | 本 Node 尺寸 |

**GLView 静态方法（expo-gl，Surface 内部创建；headless / 高级场景可直接使用）**

| 名称     | 类型     | 参数类型 | 返回值 | 必填    | 平台 | OpenHarmony平台支持 | 描述  |
|--------|---------|-----|-------|-------|--------|-----|-----------------|
| takeSnapshotAsync | function | (gl \| ctxId, options?) | Promise\<GLSnapshot\> | No | All | yes | 截图存入应用沙箱 cacheDir，返回 {uri, localUri, width, height}；uri 可直接给 \<Image\> 或再作纹理输入。format 支持 jpeg/png/webp（webp 自动降级 png 并告警）；flip/rect/compress/framebuffer 参数均可用 |
| createContextAsync | function | / | Promise\<gl\> | No | All | yes | 创建 headless 上下文（无视图）；takeSnapshotAsync 前需 gl.flushEXP()（headless 无渲染循环，不 flush 报 E_GL_NO_FRAMEBUFFER） |
| destroyContextAsync | function | (gl \| ctxId) | Promise\<boolean\> | No | All | yes | 销毁 headless 上下文 |
| getWorkletContext | function | (ctxId) | gl \| undefined | No | iOS/Android | no | Reanimated worklet 线程内取上下文；鸿蒙侧未验证（需引入 Reanimated 鸿蒙适配依赖），暂按不支持 |

**GL 上下文扩展（EXGL，onContextCreate 收到的 gl 上可用）**

| 名称     | 类型     | 参数类型 | 返回值 | 必填    | 平台 | OpenHarmony平台支持 | 描述  |
|--------|---------|-----|-------|-------|--------|-----|-----------------|
| endFrameEXP | function | / | void | No | All | yes | 结束当前帧并上屏（Surface 每帧自动调用） |
| flushEXP | function | / | void | No | All | yes | 提交命令队列；headless 场景必须手动调用 |
| getExtension("GLViewRef") | function | name | ref | No | RN 平台 | yes | 取底层 GLView 引用（gl-react-expo 内部使用） |
| drawingBufferWidth / drawingBufferHeight | property | / | number | No | All | yes | 画布像素尺寸；上下文创建时冻结、不随布局更新（宽高方向正确，无转置） |
| getExtension（其余扩展） | function | name | object \| null | No | All | no | 驱动扩展未按 WebGL 扩展面桥接，返回 null 并告警 |
| getParameter（范围/字符串型 pname） | function | pname | number | No | All | no | 仅数值标量可用；范围/字符串型 pname 返回 -1 或 0 |
| texImage2D 六参 DOM 源形式 | function | 六参 | void | No | All | no | 无浏览器语义；请走纹理 loader URI 路径（九参全量形式） |

**Uniform 特殊值**

| 名称     | 类型     | 参数类型 | 返回值 | 必填    | 平台 | OpenHarmony平台支持 | 描述  |
|--------|---------|-----|-------|-------|--------|-----|-----------------|
| Uniform.Backbuffer | symbol 值 | / | / | No | All | yes | 注入本 Node 上一帧 framebuffer（需 backbuffering） |
| Uniform.backbufferFrom | 工厂 | (node \| bus) | 对象 | No | All | yes | 注入指定 Node 的 backbuffer |
| Uniform.Resolution | symbol 值 | / | / | No | All | yes | 注入本 Node 尺寸 [width, height] |
| Uniform.textureSize | 工厂 | (texture) | 对象 | No | All | yes | 注入某纹理输入的 [w, h] |
| Uniform.textureSizeRatio | 工厂 | (texture) | 对象 | No | All | yes | 注入某纹理输入的宽高比 w / h |

**纹理输入支持**

| 输入形式 | 参数类型 | 必填 | 平台 | OpenHarmony平台支持 | 描述 |
|---|---|---|---|---|---|
| require("./img.png") | number（资源 id） | — | All | yes | 经 ExpoAsset 落沙箱后原生解码上传；解码仅支持 PNG/JPEG |
| {uri: "https://..."} | {uri: string} | — | All | yes | 远程纹理；需设备有网 + ohos.permission.INTERNET |
| {uri: "file://..."} | {uri: string} | — | All | yes | 沙箱文件（如 GLSnapshot localUri 回灌）；仅 PNG/JPEG |
| \<Node\> / \<Bus\> 输出 | 实例 | — | All | yes | FBO 纹理直接作为 sampler2D 输入 |
| WebP 图片 | — | — | — | no | 原生 stb 解码仅编入 PNG/JPEG |

### 平台差异说明

- **帧保留语义**：实现固定保留最后一帧（等价 WebGL `preserveDrawingBuffer: true` 的超集），`capture`/快照导出始终可读。
- **同步查询**：`getShaderParameter`/`getUniformLocation`/`getUniform` 等会先提交已排队命令再在原生侧同步执行，与 WebGL 顺序语义一致。
- **快照格式**：`format: 'image/jpeg'` 无纯 native JPEG 编码入口，回退 PNG（像素内容一致，仅封装格式不同）；`webp` 自动降级 `png` 并告警。
- **上下文生命周期**：页面切换导致的 surface 销毁不再视为上下文丢失（GL 资源跨 surface 存活）。

## 使用说明

- 着色器语言为 GLSL ES 3.00（WebGL2 语义）；实际可用能力以鸿蒙 EXGL 的 WebGL 2.0 子集为准（demo 已覆盖常用内置函数/uniform/纹理语法）。
- GL 调用经 JS 批处理后每帧一次跨语言下发；示例规模（≤10 节点）可流畅运行。
- 远程纹理（`http(s)://`）失败走 `onLoadError`，不阻塞其余渲染。
- 建议每屏挂载 1 个 Surface；多个 Surface 可同屏共存（demo 实测 3 个），并发稳定性未充分压测。

## 遗留问题

- [ ] WebGL 扩展未桥接（`getExtension` 返回 null）；float 线性过滤等能力依赖内置 uint8 降级路径。
- [ ] `image/jpeg` 快照格式回退为 PNG（像素内容一致，仅封装格式不同）；`webp` 快照同样降级 `png`。
- [ ] 不支持 `gl.texImage2D` 六参 DOM/ImageSource 源形式。
- [ ] WebP 图片纹理不支持（原生解码仅 PNG/JPEG）。
- [ ] `captureAsDataURL` / `captureAsBlob` 上游仅 Web 实现，鸿蒙不提供（请用 `takeSnapshotAsync` / `capture`）。
- [ ] Reanimated worklet 访问 GL（`enableExperimentalWorkletSupport` / `getWorkletContext`）未验证，暂按不支持。
- [ ] `msaaSamples`（GLView prop）上游即 iOS 专属，鸿蒙忽略该值。
- [ ] 同屏多 Surface 并发渲染未充分压测。

## 其他

### 与源库差异说明

- 声明式用法与 gl-react-native 完全一致；渲染由 ExpoGLView 原生层执行（XComponent + EGL + GLES3），`onContextCreate` 收到的 `gl` 为 WebGL 2.0 语义子集代理（批处理下发，同步查询在原生侧顺序执行）。
- 快照格式：原生侧当前无纯 native JPEG 编码入口，`format: 'image/jpeg'` 的快照请求回退 PNG，像素内容一致，仅封装格式不同。
- WebGL 扩展：鸿蒙 GLES 驱动未按 WebGL 扩展面暴露，`getExtension` 返回 null。
- 已验证修复：`blendFunc` 的 `zero` 守卫（不再被误判缺参而静默丢弃 blend）、GL 上下文生命周期内存泄漏、drawingBuffer 宽高转置（`SET_BUFFER_GEOMETRY` 参数顺序）。

## 目录结构

````
/gl-react                           # 项目根目录（上游 monorepo fork）
└── packages/gl-react               # @react-native-ohos/gl-react 包（gl-react 核心别名包，纯 JS）
    ├── src                         # gl-react 核心代码（Shaders/GLSL/Node/Bus/Uniform/connectSize 等）
    ├── jtest                       # 单元测试
    ├── example                     # RNOH 验证工程（含 harmony 原生工程，20 个验证用例）
    ├── react-native-ohos-gl-react-1.0.0-beta.1.tgz            # 本包 tgz
    ├── react-native-ohos-gl-react-native-6.1.0-beta.1.tgz      # gl-react-native 绑定别名包 tgz
    ├── react-native-ohos-expo-gl-1.0.0-beta.1.tgz              # expo-gl 鸿蒙适配 tgz（含 expo_gl.har）
    ├── react-native-ohos-expo-asset-1.0.0-beta.1.tgz           # expo-asset 适配 tgz
    ├── react-native-ohos-expo-modules-core-1.0.0-beta.1.tgz    # expo-modules-core 适配 tgz
    ├── README.md                   # 中文安装使用方法
    └── README_EN.md                # 英文安装使用方法
````

## 贡献代码

使用过程中发现任何问题都可以提交 [Issue](https://github.com/tyBrave/gl-react/issues)，当然，也非常欢迎提交 [PR](https://github.com/tyBrave/gl-react/pulls) 。

## 开源协议

本项目基于原库 [gl-react](https://github.com/gre/gl-react) 的 [The MIT License (MIT)](./LICENSE) ，请自由地享受和参与开源。
