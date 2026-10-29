> 文档模板：v0.4.2

<p align="center">
  <h1 align="center"> <code>gl-react-native</code> </h1>
</p>

本项目基于 [gl-react-native](https://github.com/react-native-oh-library/gl-react/tree/master/packages/gl-react-native) 开发，为 React Native 鸿蒙（OpenHarmony）适配版本。

该三方库的鸿蒙适配版本支持直接从仓库下载 tgz 使用，版本所属关系如下：

| 三方库名称    | 三方库版本    | 发布信息     | 支持RN版本    | Autolink     | 编译API版本     | 社区基线版本    |  源码地址   |
| ------------ | ------------ | ------------------------------ | ------------- | ------------- |------------------------ | ------------- | ------------- |
| @react-native-ohos/gl-react-native | [~ 6.1.0(in progress)]() | [Github Releases]( https://github.com/react-native-oh-library/gl-react/releases) | 0.72.* / 0.77.* / 0.82.* / 0.84.* | 是 | API13+ | 6.1.0 | [master](https://github.com/tyBrave/gl-react/tree/master/packages/gl-react-native) |
| @react-native-ohos/gl-react | [~ 1.0.0(in progress)]() | [Github Releases]( https://github.com/react-native-oh-library/gl-react/releases) | 0.72.* / 0.77.* / 0.82.* / 0.84.* | 是 | API13+ | 6.0.0 | [master](https://github.com/tyBrave/gl-react/tree/master/packages/gl-react) |
| @react-native-ohos/expo-gl | [~ 1.0.0(in progress)]() | [Github Releases](https://github.com/tyBrave/expo/releases) | 0.72.* / 0.77.* / 0.82.* / 0.84.* | 是 | API13+ | 58.0.3 | [main](https://github.com/tyBrave/expo/tree/main/packages/expo-gl) |

## 简介

gl-react-native 是一个通用的 React 库，用于编写和组合 WebGL 着色器。
> [!TIP] 使用需引入[@react-native-ohos/expo-gl](https://github.com/tyBrave/expo/tree/main/packages/expo-gl),其引入步骤需参考下方[Link]()说明

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

## 依赖关系说明

请根据应用工程使用的 RN 框架版本，选择对应版本的三方库进行引入，版本对应关系如下：

| RN 框架版本 | 鸿蒙化依赖库 | 支持版本范围 |
| --- | --- | --- |
| 0.72、0.77、0.82、0.84 | @react-native-ohos/gl-react | >=1.0.0 <1.1.0 |
| | @react-native-ohos/gl-react-native | >=6.1.0 <6.2.0 |
| | @react-native-ohos/expo-gl | >=1.0.0 <1.1.0 |
| | @react-native-ohos/expo-asset | >=1.0.0 <1.1.0 |
| | @react-native-ohos/expo-modules-core | >=1.0.0 <1.1.0 |

本库鸿蒙侧实现依赖上述鸿蒙化三方库，如已在鸿蒙应用工程中引入，可跳过本章节步骤，直接使用。

> [!TIP] 请确保引入的三方库版本与应用工程的 RN 框架版本匹配，不匹配的版本可能导致编译或运行异常。`gl-react`、`gl-react-expo` 直接使用 npm 官方版本（`^6.0.0`），无需修改。

## Link

|                                      | 是否支持autolink | RN框架版本 |
|--------------------------------------|----------------|-----------|
| ~ 6.1.0-beta.1                       | 是             |  0.72     |
| ~ 1.0.0-beta.1                       | 是             |  0.72     |

使用AutoLink的工程需要根据该文档配置，Autolink框架指导文档：https://gitcode.com/openharmony-sig/ohos_react_native/blob/master/docs/zh-cn/Autolinking.md

如您使用的版本支持 Autolink，并且工程已接入 Autolink，可跳过ManualLink配置。
<details>
  <summary>ManualLink: 此步骤为手动配置原生依赖项的指导</summary>

首先需要使用 DevEco Studio 打开项目里的 HarmonyOS 工程 `harmony`。

### 1. Overrides RN SDK

为了让工程依赖同一个版本的 RN SDK，需要在工程根目录的 `oh-package.json5` 添加 overrides 字段，指向工程需要使用的 RN SDK 版本。替换的版本既可以是一个具体的版本号，也可以是一个模糊版本，还可以是本地存在的 HAR 包或源码目录。

关于该字段的作用请阅读[官方说明](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides-V5/ide-oh-package-json5-V5#zh-cn_topic_0000001792256137_overrides)

```json
{
  "overrides": {
    "@rnoh/react-native-openharmony": "~0.72.139" // ohpm 在线版本
    // "@rnoh/react-native-openharmony" : "./react_native_openharmony.har" // 指向本地 har 包的路径
    // "@rnoh/react-native-openharmony" : "./react_native_openharmony" // 指向源码路径
  }
}
```

### 2. 引入原生端代码

目前有两种方法：

- 通过 har 包引入；
- 直接链接源码。

方法一：通过 har 包引入（推荐）

> [!TIP] har 包位于三方库安装路径的 `harmony` 文件夹下。

打开 `entry/oh-package.json5`，添加以下依赖

```json
"dependencies": {
    "@react-native-ohos/expo-gl": "file:../../node_modules/@react-native-ohos/expo-gl/harmony/expo_gl.har"
  }
```

`harmony/oh-package.json5` 中按实际路径相应添加（`file:../node_modules/...`）。

方法二：直接链接源码

> [!TIP] 如需使用直接链接源码，请参考 [expo-gl 源码仓库](https://github.com/tyBrave/expo/tree/main/packages/expo-gl) 的 `harmony` 目录。

### 3. 配置 CMakeLists 和引入 ExpoGlPackage

打开 `entry/src/main/cpp/CMakeLists.txt`，添加：

```diff
project(rnapp)
cmake_minimum_required(VERSION 3.4.1)
set(CMAKE_SKIP_BUILD_RPATH TRUE)
set(RNOH_APP_DIR "${CMAKE_CURRENT_SOURCE_DIR}")
set(NODE_MODULES "${CMAKE_CURRENT_SOURCE_DIR}/../../../../../node_modules")
+ set(OH_MODULES "${CMAKE_CURRENT_SOURCE_DIR}/../../../oh_modules")
set(RNOH_CPP_DIR "${CMAKE_CURRENT_SOURCE_DIR}/../../../../../../react-native-harmony/harmony/cpp")
set(LOG_VERBOSITY_LEVEL 1)
set(CMAKE_ASM_FLAGS "-Wno-error=unused-command-line-argument -Qunused-arguments")
set(CMAKE_CXX_FLAGS "-fstack-protector-strong -Wl,-z,relro,-z,now,-z,noexecstack -s -fPIE -pie")
set(WITH_HITRACE_SYSTRACE 1) # for other CMakeLists.txt files to use
add_compile_definitions(WITH_HITRACE_SYSTRACE)

add_subdirectory("${RNOH_CPP_DIR}" ./rn)

# RNOH_BEGIN: manual_package_linking_1
add_subdirectory("../../../../sample_package/src/main/cpp" ./sample-package)
+ add_subdirectory("${OH_MODULES}/@react-native-ohos/expo-gl/src/main/cpp" ./expo-gl)
# RNOH_END: manual_package_linking_1

file(GLOB GENERATED_CPP_FILES "./generated/*.cpp")

add_library(rnoh_app SHARED
    ${GENERATED_CPP_FILES}
    "./PackageProvider.cpp"
    "${RNOH_CPP_DIR}/RNOHAppNapiBridge.cpp"
)
target_link_libraries(rnoh_app PUBLIC rnoh)

# RNOH_BEGIN: manual_package_linking_2
target_link_libraries(rnoh_app PUBLIC rnoh_sample_package)
+ target_link_libraries(rnoh_app PUBLIC expo_gl)
# RNOH_END: manual_package_linking_2
```

> [!TIP] har 包安装（ohpm install）后，C++ 源码解包于 `oh_modules/@react-native-ohos/expo-gl/src/main/cpp`，其 CMake 目标名为 `expo_gl`。

打开 `entry/src/main/cpp/PackageProvider.cpp`，添加：

```diff
#include "RNOH/PackageProvider.h"
#include "SamplePackage.h"
+ #include "ExpoGlPackage.h"

using namespace rnoh;

std::vector<std::shared_ptr<Package>> PackageProvider::getPackages(Package::Context ctx) {
    return {
      std::make_shared<SamplePackage>(ctx),
+     std::make_shared<ExpoGlPackage>(ctx)
    };
}
```

### 4. 在 ArkTs 侧引入 ExpoGLView

找到 **function buildCustomRNComponent()**，一般位于 `entry/src/main/ets/pages/Index.ets` 或 `entry/src/main/ets/rn/LoadBundle.ets`，添加：

```diff
  ...
+ import { ExpoGLView } from "@react-native-ohos/expo-gl"

@Builder
export function buildCustomRNComponent(ctx: ComponentBuilderContext) {
  ...
+ if (ctx.componentName === ExpoGLView.NAME) {
+   ExpoGLView({
+     ctx: ctx.rnComponentContext,
+     tag: ctx.tag
+   })
+ }
  ...
}
```

> [!TIP] 本库使用了混合方案，需要添加组件名。

在`entry/src/main/ets/pages/Index.ets` 或 `entry/src/main/ets/rn/LoadBundle.ets` 找到常量 `arkTsComponentNames` 在其数组里添加组件名

```diff
const arkTsComponentNames: Array<string> = [
+ ExpoGLView.NAME
  ];
```

### 5. 在 ArkTs 侧引入 ExpoGlPackage

打开 `entry/src/main/ets/RNPackagesFactory.ets`，添加：

```diff
  ...
+ import { ExpoGlPackage } from "@react-native-ohos/expo-gl";

export function createRNPackages(ctx: RNPackageContext): RNPackage[] {
  return [
+    new ExpoGlPackage(ctx)
  ];
}
```
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

1. RNOH: 0.72.139; SDK: HarmonyOS 6.0.0 Release SDK; IDE: DevEco Studio 5.0; ROM: 6.0.0;

### 权限要求

- 如果纹理 source 使用网络 url，应用需要申请网络权限

  在 `entry/src/main/module.json5` 中添加

```json
"requestPermissions": [
  {
    "name": "ohos.permission.INTERNET",
  },
],
```

## 使用示例
下面的代码展示了这个库的基本使用场景：

> [!WARNING] 使用时 import 的库名不变。

```tsx
import React from "react";
import { Surface } from "gl-react-native";
import { Node, Shaders, GLSL } from "gl-react";

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

const HelloBlue = ({ blue }: { blue: number }) => (
  <Node shader={shaders.helloBlue} uniforms={{ blue }} />
);

const App = () => {
  return (
    <Surface style={{ width: 300, height: 300 }}>
      <HelloBlue blue={0.8} />
    </Surface>
  );
};

export default App;
```

## 使用说明
**图片纹理**
```tsx
<Node
  shader={shaders.saturate}
  uniforms={{
    tex: { uri: "https://server/path/photo.jpg" }, // 支持 require() 资源、http(s)://、file://
    saturation: 0.8,
  }}
/>
```

**像素读回**
```tsx
const surfaceRef = useRef(null);

<Surface ref={surfaceRef} style={{ width: 300, height: 300 }}>
  <Node shader={shaders.helloBlue} uniforms={{ blue: 0.8 }} />
</Surface>;

// 全画布或区域读回，返回 ndarray([h, w, 4])
const pixels = surfaceRef.current.capture();
const half = surfaceRef.current.capture(0, 0, 150, 300);
```

**截图导出**
```tsx
// 快照落入应用沙箱 cacheDir，返回 { uri, localUri, width, height }
// uri 可直接给 <Image>，也可回灌为纹理输入
const snapshot = await GLView.takeSnapshotAsync(gl, { format: "png" });
```

**离屏上下文**
```tsx
const gl = await GLView.createContextAsync();
gl.clearColor(0, 0, 1, 1);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.flushEXP(); // headless 无渲染循环，导出前必须手动 flush
const snapshot = await GLView.takeSnapshotAsync(gl, { format: "png" });
await GLView.destroyContextAsync(gl);
```

## 接口说明

> [!TIP] "Platform"列表示该属性在原三方库上支持的平台。

> [!TIP] "OpenHarmony Support"列为 yes 表示 OpenHarmony平台支持 该属性；no 则表示不支持；partially 表示部分支持。使用方法跨平台一致，效果对标 iOS 或 Android 的效果。

### 组件
| 名称       | 参数类型     | 必填  | 平台  | OpenHarmony平台支持| 描述 |
|------------|------------|----------------------|------|-----|----------------|
| Surface | [SurfaceProps](#surfaceprops) | yes  | all | yes | GL 渲染容器组件，承载 WebGL 上下文与根 Node 树 |
| Node | [NodeProps](#nodeprops) | yes  | all | yes | 着色器节点组件，可嵌套组合，子 Node 输出纹理作为父 Node 的 uniform 输入 |
| Bus | [BusProps](#busprops) | No  | all | yes | 纹理总线，跨多个消费者共享一份计算 |
| LinearCopy | [SurfaceProps](#surfaceprops) | No  | all | yes | 纹理拷贝渲染容器（线性采样） |
| NearestCopy | [SurfaceProps](#surfaceprops) | No  | all | yes | 纹理拷贝渲染容器（最近邻采样） |
| Shaders.create | object | yes  | all | yes | 注册着色器：`Shaders.create({ name: { frag: GLSL\`...\` } })` |
| GLSL | tagged template | yes  | all | yes | 片元着色器模板字符串标签 |
| Uniform | symbol / 工厂 | No  | all | yes | 声明式特殊 uniform（Backbuffer、Resolution 等，见 API 表） |
| connectSize | HOC | No  | all | yes | 把 Surface 的 GL 尺寸注入业务组件 props（width/height） |
| createSurface | factory | No  | all | yes | 平台绑定工厂，适配内部使用 |
| listSurfaces | function | No  | all | yes | 枚举当前所有 Surface 实例（调试用） |
| Visitor / VisitorLogger / Visitors | object | No  | all | yes | 绘制生命周期观察者（调试用） |
| Backbuffer（字符串常量） | constant | No  | all | no | 旧写法，等价 `Uniform.Backbuffer`，使用会打印弃用警告 |

### 属性
SurfaceProps

| 名称                           | 参数类型          | 默认值       | 必填            | 平台   | HarmonyOS平台支持    | 描述 |
|------------------------------|--------------------|------------|---------------|------|------------------|---------------|
| children | ReactNode | None | Yes | All | Yes | GL 渲染树，须含一个可发现的根 Node（根 Node 直接绘制到 Surface 画布） |
| style | StyleProp\<ViewStyle\> | None | No | All | Yes | 容器样式；宽高决定 drawingBuffer 尺寸（像素密度生效） |
| preload | Array\<any\> | None | No | All | Yes | GL 就绪前预加载的纹理资源，全部完成才触发 onLoad |
| onLoad | Function | None | No | All | Yes | GL 上下文就绪、preload 完成、首帧绘制完成后的回调 |
| onLoadError | Function | None | No | All | Yes | GL 创建/preload 失败回调，参数为 Error |
| onContextLost | Function | None | No | All | No | Web 语义事件，expo-gl 原生平台（含 iOS/Android）均无此事件，永不触发 |
| onContextRestored | Function | None | No | All | No | 同上 |
| visitor | VisitorLike \| VisitorLike[] | None | No | All | Yes | 挂载绘制调试访问器 |
| 其余 ViewProps | ViewProps | None | No | All | Yes | 未识别的 props 原样透传给底层 GLView |

NodeProps

| 名称                           | 参数类型          | 默认值       | 必填            | 平台   | HarmonyOS平台支持    | 描述 |
|------------------------------|--------------------|------------|---------------|------|------------------|---------------|
| shader | ShaderIdentifier \| {frag, vert?} | None | Yes | All | Yes | `Shaders.create` 的键或内联定义；vert 缺省用内置全屏大三角 |
| uniforms | object | {} | No | All | Yes | uniform 值：数值/数组、sampler2D（require() 资源、{uri}（http(s)/file/data）、Node、Bus、Uniform.*） |
| uniformsOptions | object | {} | No | All | Yes | 纹理 uniform 采样参数：interpolation（linear/nearest）、wrap（clamp to edge/repeat/mirrored repeat） |
| ignoreUnusedUniforms | string[] \| boolean | — | No | All | Yes | 抑制"uniform 未在 shader 中声明"的警告 |
| sync | boolean | false | No | All | Yes | props 更新后立即同步绘制 |
| width / height | number | 继承父级 GL 尺寸 | No | All | Yes | 非根节点为其 FBO 尺寸；根节点必须与 Surface 尺寸一致 |
| children | ReactNode | — | No | All | Yes | 子 Node/Bus 组成渲染图 |
| backbuffering | boolean | false | No | All | Yes | 启用 backbuffer 双 FBO（供 Uniform.Backbuffer）；挂载后不可变更；根节点不支持 |
| blendFunc | {src, dst} | 常规 alpha 混合 | No | All | Yes | 混合方程；zero/one/src alpha 等别名全部可用 |
| clear | {color: [r,g,b,a]} \| null | {color:[0,0,0,0]} | No | All | Yes | 绘制前清屏色；null 表示不清屏（叠加合成用） |
| onDraw | Function | None | No | All | Yes | 每次实际绘制后回调 |

BusProps

| 名称                           | 参数类型          | 默认值       | 必填            | 平台   | HarmonyOS平台支持    | 描述 |
|------------------------------|--------------------|------------|---------------|------|------------------|---------------|
| children | ReactElement \| (redraw) => ReactElement | — | Yes | All | Yes | 被复用的内容；函数式 children 可拿 redraw |
| uniform | string | — | No | All | Yes | 挂到父 Node 的哪个 sampler2D uniform |
| index | number | 0 | No | All | Yes | uniform 为纹理数组时的下标 |

### API
| 名称     | 类型     | 参数类型 | 返回值 | 必填    | 平台 | OpenHarmony平台支持 | 描述  |
|--------|---------|-----|-------|-------|--------|-----|-----------------|
| Surface#capture | function | (x?, y?, w?, h?) | NDArray | No | All | Yes | 像素读回（原生同步 readPixels），全画布/区域均可，内部委托 root Node |
| Surface#redraw | function | / | void | No | All | Yes | 标记脏，下一帧重绘 |
| Surface#flush | function | / | void | No | All | Yes | 立即同步执行一次绘制 |
| Surface#glIsAvailable | function | / | boolean | No | All | Yes | GL 上下文是否存活 |
| Surface#getGLSize | function | / | [w, h] | No | All | Yes | drawingBuffer 尺寸；上下文创建时冻结，不随后续布局变化 |
| Surface#rebootForDebug | function | / | void | No | All | Yes | 调试用：GLView 整体重挂、上下文销毁重建；多 Node 树重挂时挂载顺序可能颠倒，复杂树慎用 |
| Surface#captureAsDataURL | function | ({format, quality}) | Promise\<string\> | No | All | No | 上游仅 Web 实现；请用 GLView.takeSnapshotAsync 替代 |
| Surface#captureAsBlob | function | ({format, quality}) | Promise\<Blob\> | No | All | No | 同上 |
| Node#capture | function | (x?, y?, w?, h?) | NDArray | No | All | Yes | 读本 Node 像素：root 全画布与离屏子 Node FBO 均可 |
| Node#redraw / flush | function | / | void | No | All | Yes | 标记脏 / 立即绘制 |
| Node#setDrawProps | function | Partial\<Props\> | void | No | All | Yes | 命令式局部更新 props |
| Node#getGLOutput | function | / | WebGLTexture | No | All | Yes | 本 Node FBO 颜色纹理（根 Node 不可用） |
| Node#getGLBackbufferOutput | function | / | WebGLTexture | No | All | Yes | backbuffer 纹理（需 backbuffering） |
| Node#getGLSize | function | / | [w, h] | No | All | Yes | 本 Node 尺寸 |
| GLView.takeSnapshotAsync | function | (gl \| ctxId, options?) | Promise\<GLSnapshot\> | No | All | Yes | 截图存入应用沙箱 cacheDir，返回 {uri, localUri, width, height}；uri 可给 \<Image\> 或回灌纹理；format 支持 jpeg/png/webp（webp 降级 png）；flip/rect/compress/framebuffer 均可用 |
| GLView.createContextAsync | function | / | Promise\<gl\> | No | All | Yes | 创建 headless 上下文（无视图）；导出前需 gl.flushEXP() |
| GLView.destroyContextAsync | function | (gl \| ctxId) | Promise\<boolean\> | No | All | Yes | 销毁 headless 上下文 |
| GLView.getWorkletContext | function | (ctxId) | gl \| undefined | No | iOS, Android | No | Reanimated worklet 线程内取上下文；鸿蒙侧未验证，按不支持 |
| gl.endFrameEXP | function | / | void | No | All | Yes | 结束当前帧并上屏（Surface 每帧自动调用） |
| gl.flushEXP | function | / | void | No | All | Yes | 提交命令队列；headless 场景必须手动调用 |
| gl.getExtension("GLViewRef") | function | name | ref | No | All | Yes | 取底层 GLView 引用（gl-react-expo 内部使用） |
| gl.drawingBufferWidth / Height | property | / | number | No | All | Yes | 画布像素尺寸；上下文创建时冻结（宽高方向正确） |
| gl.getExtension（其余扩展） | function | name | object \| null | No | All | No | 驱动扩展未按 WebGL 扩展面桥接，返回 null 并告警 |
| gl.getParameter（范围/字符串型 pname） | function | pname | number | No | All | No | 仅数值标量可用；范围/字符串型返回 -1 或 0 |
| gl.texImage2D（六参 DOM 源形式） | function | 六参 | void | No | All | No | 无浏览器语义；请走纹理 loader URI 路径（九参形式） |
| Uniform.Backbuffer | symbol | / | / | No | All | Yes | 注入本 Node 上一帧 framebuffer（需 backbuffering） |
| Uniform.backbufferFrom | function | (node \| bus) | object | No | All | Yes | 注入指定 Node 的 backbuffer |
| Uniform.Resolution | symbol | / | / | No | All | Yes | 注入本 Node 尺寸 [width, height] |
| Uniform.textureSize | function | (texture) | object | No | All | Yes | 注入某纹理输入的 [w, h] |
| Uniform.textureSizeRatio | function | (texture) | object | No | All | Yes | 注入某纹理输入的宽高比 w / h |

## 遗留问题

- WebGL 扩展未桥接（`gl.getExtension` 返回 null）；float 线性过滤等能力依赖内置 uint8 降级路径
- 不支持 `gl.texImage2D` 六参 DOM/ImageSource 源形式
- WebP 图片纹理不支持
- `captureAsDataURL` / `captureAsBlob` 上游仅 Web 实现，鸿蒙不提供（请用 `takeSnapshotAsync` / `capture`）
- `msaaSamples`（GLView prop）上游即 iOS 专属，鸿蒙忽略该值

## 其他
无

## 目录结构
````
/gl-react                           # 项目根目录（上游 monorepo fork）
└── packages/gl-react               # @react-native-ohos/gl-react（gl-react 核心别名包，纯 JS）
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

使用过程中发现任何问题都可以提交 [Issue](https://github.com/react-native-oh-library/gl-react)，当然，也非常欢迎提交 [PR](https://github.com/react-native-oh-library/gl-react/pulls) 。

## 开源协议

本项目基于 [The MIT License (MIT)](https://github.com/gre/gl-react/blob/master/LICENSE) ，请自由地享受和参与开源。
