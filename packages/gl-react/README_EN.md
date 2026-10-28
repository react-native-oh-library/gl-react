> Document Template: v0.4.2

<p align="center">
  <h1 align="center"> <code>gl-react-native</code> </h1>
</p>

This project is based on [gl-react-native](https://github.com/react-native-oh-library/gl-react/tree/master/packages/gl-react-native) and is the OpenHarmony adaptation of gl-react-native for React Native.

The OpenHarmony-adapted packages of this library can be downloaded as tgz directly from the repository. The version mapping is as follows:

| Library Name    | Version    | Release Info     | RN Version Supported    | Autolink     | API Version     | Community Baseline    |  Source Code   |
| ------------ | ------------ | ------------------------------ | ------------- | ------------- |------------------------ | ------------- | ------------- |
| @react-native-ohos/gl-react-native | [~ 6.1.0-beta.1](https://github.com/tyBrave/gl-react/tree/master/packages/gl-react-native) | [Github Releases](https://github.com/tyBrave/gl-react/releases) | 0.72.* | Yes | API13+ | 6.1.0 | [master](https://github.com/tyBrave/gl-react/tree/master/packages/gl-react-native) |
| @react-native-ohos/gl-react | [~ 1.0.0-beta.1](https://github.com/tyBrave/gl-react/tree/master/packages/gl-react) | [Github Releases](https://github.com/tyBrave/gl-react/releases) | 0.72.* | Yes | API13+ | 6.0.0 | [master](https://github.com/tyBrave/gl-react/tree/master/packages/gl-react) |
| @react-native-ohos/expo-gl | [~ 1.0.0-beta.1](https://github.com/tyBrave/expo/tree/main/packages/expo-gl) | [Github Releases](https://github.com/tyBrave/expo/releases) | 0.72.* | Yes | API13+ | 58.0.3 | [main](https://github.com/tyBrave/expo/tree/main/packages/expo-gl) |

## Introduction

gl-react-native is a generic React library to write and compose WebGL shaders.

> [!TIP] Using this library requires [@react-native-ohos/expo-gl](https://github.com/tyBrave/expo/tree/main/packages/expo-gl); for its integration steps, refer to the [Link]() section below.

## Installation

Enter the project directory and run:

**npm**

```bash
npm install @react-native-ohos/gl-react-native
```

**yarn**

```bash
yarn add @react-native-ohos/gl-react-native
```

## Dependencies

Choose the library versions matching the RN framework version of your application project. The version mapping is as follows:

| RN Framework Version | OpenHarmony-adapted Library | Supported Version Range |
| --- | --- | --- |
| 0.72 | @react-native-ohos/gl-react | >=1.0.0-beta.1 <1.1.0 |
| | @react-native-ohos/gl-react-native | >=6.1.0-beta.1 <6.2.0 |
| | @react-native-ohos/expo-gl | >=1.0.0-beta.1 <1.1.0 |
| | @react-native-ohos/expo-asset | >=1.0.0-beta.1 <1.1.0 |
| | @react-native-ohos/expo-modules-core | >=1.0.0-beta.1 <1.1.0 |

The OpenHarmony implementation of this library depends on the adapted libraries above. If they are already included in your OpenHarmony application project, skip this section.

> [!TIP] Make sure the library versions match the RN framework version of the project; mismatched versions may cause build or runtime failures. `gl-react` and `gl-react-expo` use the official npm versions (`^6.0.0`) directly.

## Link

|                                      | Autolink Supported | RN Framework Version |
|--------------------------------------|----------------|-----------|
| ~ 6.1.0-beta.1                       | Yes            |  0.72     |
| ~ 1.0.0-beta.1                       | Yes            |  0.72     |

Projects using AutoLink should follow the Autolink guide: https://gitcode.com/openharmony-sig/ohos_react_native/blob/master/docs/zh-cn/Autolinking.md

If your version supports Autolink and the project has integrated Autolink, skip the ManualLink configuration.
<details>
  <summary>ManualLink: guidance for manually configuring native dependencies</summary>

Open the HarmonyOS project `harmony` with DevEco Studio.

### 1. Overrides RN SDK

To make the project depend on the same RN SDK version, add the `overrides` field in the root `oh-package.json5` of the project, pointing to the RN SDK version to use. The value can be a specific version, a fuzzy version, or a local HAR package or source directory.

For how this field works, read the [official documentation](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides-V5/ide-oh-package-json5-V5#zh-cn_topic_0000001792256137_overrides)

```json
{
  "overrides": {
    "@rnoh/react-native-openharmony": "~0.72.139" // ohpm online version
    // "@rnoh/react-native-openharmony" : "./react_native_openharmony.har" // path to a local har package
    // "@rnoh/react-native-openharmony" : "./react_native_openharmony" // path to source code
  }
}
```

### 2. Import the Native Code

There are currently two methods:

- Import via a har package;
- Link the source code directly.

Method 1: Import via a har package (recommended)

> [!TIP] The har package is located in the `harmony` folder of the installed library.

Open `entry/oh-package.json5` and add the following dependency

```json
"dependencies": {
    "@react-native-ohos/expo-gl": "file:../../node_modules/@react-native-ohos/expo-gl/harmony/expo_gl.har"
  }
```

Add the corresponding dependency in `harmony/oh-package.json5` as well (`file:../node_modules/...`), according to the actual path.

Method 2: Link the source code directly

> [!TIP] To link the source code directly, refer to the `harmony` directory of the [expo-gl source repository](https://github.com/tyBrave/expo/tree/main/packages/expo-gl).

### 3. Configure CMakeLists and import ExpoGlPackage

Open `entry/src/main/cpp/CMakeLists.txt` and add:

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

> [!TIP] After the har package is installed (ohpm install), the C++ sources are unpacked at `oh_modules/@react-native-ohos/expo-gl/src/main/cpp`, and the CMake target name is `expo_gl`.

Open `entry/src/main/cpp/PackageProvider.cpp` and add:

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

### 4. Import ExpoGLView on the ArkTS side

Find **function buildCustomRNComponent()**, usually located in `entry/src/main/ets/pages/Index.ets` or `entry/src/main/ets/rn/LoadBundle.ets`, and add:

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

> [!TIP] This library uses the hybrid approach; the component name must be added.

Find the constant `arkTsComponentNames` in `entry/src/main/ets/pages/Index.ets` or `entry/src/main/ets/rn/LoadBundle.ets` and add the component name to its array

```diff
const arkTsComponentNames: Array<string> = [
+ ExpoGLView.NAME
  ];
```

### 5. Import ExpoGlPackage on the ArkTS side

Open `entry/src/main/ets/RNPackagesFactory.ets` and add:

```diff
  ...
+ import { ExpoGlPackage } from "@react-native-ohos/expo-gl";

export function createRNPackages(ctx: RNPackageContext): RNPackage[] {
  return [
+    new ExpoGlPackage(ctx)
  ];
}
```

### Run

Click the `sync` button in the top-right corner,

or run in the terminal:

```bash
cd entry
ohpm install
```

Then build and run.

## Constraints and Limitations

### Compatibility

The content of this document has been verified on:

1. RNOH: 0.72.139; SDK: HarmonyOS 6.0.0 Release SDK; IDE: DevEco Studio 5.0; ROM: 6.0.0;

### Permission Requirements

- If the texture source uses a network url, the application needs the network permission

  Add to `entry/src/main/module.json5`:

```json
"requestPermissions": [
  {
    "name": "ohos.permission.INTERNET",
  },
],
```

## Usage Example
The following code shows the basic usage scenario of this library:

> [!WARNING] The import names stay unchanged.

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

## Usage Notes
**Image Texture**
```tsx
<Node
  shader={shaders.saturate}
  uniforms={{
    tex: { uri: "https://server/path/photo.jpg" }, // require() assets, http(s)://, file:// supported
    saturation: 0.8,
  }}
/>
```

**Pixel Readback**
```tsx
const surfaceRef = useRef(null);

<Surface ref={surfaceRef} style={{ width: 300, height: 300 }}>
  <Node shader={shaders.helloBlue} uniforms={{ blue: 0.8 }} />
</Surface>;

// Full canvas or region readback, returns ndarray([h, w, 4])
const pixels = surfaceRef.current.capture();
const half = surfaceRef.current.capture(0, 0, 150, 300);
```

**Snapshot Export**
```tsx
// The snapshot is saved into the application sandbox cacheDir, returning { uri, localUri, width, height }
// The uri can feed <Image> directly, or be fed back as a texture input
const snapshot = await GLView.takeSnapshotAsync(gl, { format: "png" });
```

**Headless Context**
```tsx
const gl = await GLView.createContextAsync();
gl.clearColor(0, 0, 1, 1);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.flushEXP(); // headless has no render loop; flush manually before export
const snapshot = await GLView.takeSnapshotAsync(gl, { format: "png" });
await GLView.destroyContextAsync(gl);
```

## API Description

> [!TIP] The "Platform" column indicates the platforms supported by the property on the original library.

> [!TIP] In the "OpenHarmony Support" column, yes means OpenHarmony supports the property; no means not supported; partially means partially supported. Usage is cross-platform and consistent, with results aligned to iOS or Android.

### Components
| Name       | Parameter Type     | Required  | Platform  | OpenHarmony Support | Description |
|------------|------------|----------------------|------|-----|----------------|
| Surface | [SurfaceProps](#surfaceprops) | yes  | all | yes | GL rendering container component hosting the WebGL context and the root Node tree |
| Node | [NodeProps](#nodeprops) | yes  | all | yes | Shader node component; nestable, child Node output textures feed parent Node uniforms |
| Bus | [BusProps](#busprops) | No  | all | yes | Texture bus to share one computation across multiple consumers |
| LinearCopy | [SurfaceProps](#surfaceprops) | No  | all | yes | Texture copy rendering container (linear sampling) |
| NearestCopy | [SurfaceProps](#surfaceprops) | No  | all | yes | Texture copy rendering container (nearest sampling) |
| Shaders.create | object | yes  | all | yes | Registers shaders: `Shaders.create({ name: { frag: GLSL\`...\` } })` |
| GLSL | tagged template | yes  | all | yes | Tagged template literal for fragment shaders |
| Uniform | symbol / factory | No  | all | yes | Declarative special uniforms (Backbuffer, Resolution, etc.; see the API table) |
| connectSize | HOC | No  | all | yes | Injects the Surface GL size into business component props (width/height) |
| createSurface | factory | No  | all | yes | Platform binding factory, used internally by the adaptation |
| listSurfaces | function | No  | all | yes | Enumerates all current Surface instances (debugging) |
| Visitor / VisitorLogger / Visitors | object | No  | all | yes | Draw lifecycle observers (debugging) |
| Backbuffer (string constant) | constant | No  | all | no | Legacy form, equivalent to `Uniform.Backbuffer`; emits a deprecation warning when used |

### Props
SurfaceProps

| Name                           | Parameter Type          | Default Value       | Required            | Platform   | HarmonyOS Support    | Description |
|------------------------------|--------------------|------------|---------------|------|------------------|---------------|
| children | ReactNode | None | Yes | All | Yes | GL render tree; must contain a discoverable root Node (drawn directly onto the Surface canvas) |
| style | StyleProp\<ViewStyle\> | None | No | All | Yes | Container style; width/height determine the drawingBuffer size (pixel density applies) |
| preload | Array\<any\> | None | No | All | Yes | Texture resources preloaded before GL is ready; onLoad fires only after all complete |
| onLoad | Function | None | No | All | Yes | Callback after the GL context is ready, preload completes and the first frame is drawn |
| onLoadError | Function | None | No | All | Yes | Callback for GL creation/preload failure, receives an Error |
| onContextLost | Function | None | No | All | No | Web-semantics event; never fires on expo-gl native platforms (iOS/Android included) |
| onContextRestored | Function | None | No | All | No | Same as above |
| visitor | VisitorLike \| VisitorLike[] | None | No | All | Yes | Mounts draw debugging visitors |
| Other ViewProps | ViewProps | None | No | All | Yes | Unrecognized props are passed through to the underlying GLView |

NodeProps

| Name                           | Parameter Type          | Default Value       | Required            | Platform   | HarmonyOS Support    | Description |
|------------------------------|--------------------|------------|---------------|------|------------------|---------------|
| shader | ShaderIdentifier \| {frag, vert?} | None | Yes | All | Yes | Key from `Shaders.create` or inline definition; vert defaults to the built-in fullscreen triangle |
| uniforms | object | {} | No | All | Yes | Uniform values: numbers/arrays, sampler2D (require() assets, {uri} (http(s)/file/data), Node, Bus, Uniform.*) |
| uniformsOptions | object | {} | No | All | Yes | Texture uniform sampling options: interpolation (linear/nearest), wrap (clamp to edge/repeat/mirrored repeat) |
| ignoreUnusedUniforms | string[] \| boolean | — | No | All | Yes | Suppresses "uniform not declared in shader" warnings |
| sync | boolean | false | No | All | Yes | Draws synchronously right after props update |
| width / height | number | inherited parent GL size | No | All | Yes | Non-root nodes: their FBO size; root node must match the Surface size |
| children | ReactNode | — | No | All | Yes | Child Nodes/Buses forming the render graph |
| backbuffering | boolean | false | No | All | Yes | Enables double-FBO backbuffer (for Uniform.Backbuffer); immutable after mount; not supported on root nodes |
| blendFunc | {src, dst} | regular alpha blending | No | All | Yes | Blending equation; all aliases including zero/one/src alpha available |
| clear | {color: [r,g,b,a]} \| null | {color:[0,0,0,0]} | No | All | Yes | Clear color before drawing; null means no clear (for compositing) |
| onDraw | Function | None | No | All | Yes | Callback after each actual draw |

BusProps

| Name                           | Parameter Type          | Default Value       | Required            | Platform   | HarmonyOS Support    | Description |
|------------------------------|--------------------|------------|---------------|------|------------------|---------------|
| children | ReactElement \| (redraw) => ReactElement | — | Yes | All | Yes | Content being reused; function children receive redraw |
| uniform | string | — | No | All | Yes | Which sampler2D uniform of the parent Node to attach to |
| index | number | 0 | No | All | Yes | Index when the uniform is a texture array |

### API
| Name     | Type     | Parameter Type | Return Value | Required    | Platform | OpenHarmony Support | Description  |
|--------|---------|-----|-------|-------|--------|-----|-----------------|
| Surface#capture | function | (x?, y?, w?, h?) | NDArray | No | All | Yes | Pixel readback (native synchronous readPixels), full canvas or region; delegates to the root Node internally |
| Surface#redraw | function | / | void | No | All | Yes | Marks dirty, redraws on the next frame |
| Surface#flush | function | / | void | No | All | Yes | Performs one draw synchronously |
| Surface#glIsAvailable | function | / | boolean | No | All | Yes | Whether the GL context is alive |
| Surface#getGLSize | function | / | [w, h] | No | All | Yes | drawingBuffer size; frozen at context creation, does not follow later layout changes |
| Surface#rebootForDebug | function | / | void | No | All | Yes | For debugging: remounts the GLView entirely, destroys and recreates the context; the remount order may flip on multi-Node trees, use with care on complex trees |
| Surface#captureAsDataURL | function | ({format, quality}) | Promise\<string\> | No | All | No | Upstream Web-only; use GLView.takeSnapshotAsync instead |
| Surface#captureAsBlob | function | ({format, quality}) | Promise\<Blob\> | No | All | No | Same as above |
| Node#capture | function | (x?, y?, w?, h?) | NDArray | No | All | Yes | Reads this Node's pixels: works for the root full canvas and offscreen child Node FBOs |
| Node#redraw / flush | function | / | void | No | All | Yes | Marks dirty / draws immediately |
| Node#setDrawProps | function | Partial\<Props\> | void | No | All | Yes | Imperative partial props update |
| Node#getGLOutput | function | / | WebGLTexture | No | All | Yes | This Node's FBO color texture (not available on root Nodes) |
| Node#getGLBackbufferOutput | function | / | WebGLTexture | No | All | Yes | The backbuffer texture (requires backbuffering) |
| Node#getGLSize | function | / | [w, h] | No | All | Yes | This Node's size |
| GLView.takeSnapshotAsync | function | (gl \| ctxId, options?) | Promise\<GLSnapshot\> | No | All | Yes | Saves a snapshot into the application sandbox cacheDir, returning {uri, localUri, width, height}; the uri can feed \<Image\> or be fed back as a texture; format supports jpeg/png/webp (webp falls back to png); flip/rect/compress/framebuffer all usable |
| GLView.createContextAsync | function | / | Promise\<gl\> | No | All | Yes | Creates a headless context (no view); call gl.flushEXP() before export |
| GLView.destroyContextAsync | function | (gl \| ctxId) | Promise\<boolean\> | No | All | Yes | Destroys a headless context |
| GLView.getWorkletContext | function | (ctxId) | gl \| undefined | No | iOS, Android | No | Getting the context inside a Reanimated worklet thread; not verified on OpenHarmony, treated as unsupported |
| gl.endFrameEXP | function | / | void | No | All | Yes | Ends the current frame and presents it (called automatically by Surface each frame) |
| gl.flushEXP | function | / | void | No | All | Yes | Submits the command queue; must be called manually in headless scenarios |
| gl.getExtension("GLViewRef") | function | name | ref | No | All | Yes | Gets the underlying GLView reference (used internally by gl-react-expo) |
| gl.drawingBufferWidth / Height | property | / | number | No | All | Yes | Canvas pixel size; frozen at context creation (correct orientation) |
| gl.getExtension (other extensions) | function | name | object \| null | No | All | No | Driver extensions are not bridged as WebGL extensions; returns null with a warning |
| gl.getParameter (range/string pnames) | function | pname | number | No | All | No | Only numeric scalar pnames work; range/string pnames return -1 or 0 |
| gl.texImage2D (six-argument DOM-source form) | function | six args | void | No | All | No | No browser semantics; use the texture loader URI path (nine-argument form) |
| Uniform.Backbuffer | symbol | / | / | No | All | Yes | Injects this Node's previous-frame framebuffer (requires backbuffering) |
| Uniform.backbufferFrom | function | (node \| bus) | object | No | All | Yes | Injects a specified Node's backbuffer |
| Uniform.Resolution | symbol | / | / | No | All | Yes | Injects this Node's size [width, height] |
| Uniform.textureSize | function | (texture) | object | No | All | Yes | Injects a texture input's [w, h] |
| Uniform.textureSizeRatio | function | (texture) | object | No | All | Yes | Injects a texture input's aspect ratio w / h |

## Known Issues

- WebGL extensions are not bridged (`gl.getExtension` returns null); capabilities like float linear filtering rely on the built-in uint8 fallback path
- The six-argument DOM/ImageSource source form of `gl.texImage2D` is not supported
- WebP image textures are not supported
- `captureAsDataURL` / `captureAsBlob` are upstream Web-only implementations and are not provided on OpenHarmony (use `takeSnapshotAsync` / `capture`)
- `msaaSamples` (GLView prop) is upstream iOS-only; the value is ignored on OpenHarmony

## Others
None

## Directory Structure
````
/gl-react                           # project root (upstream monorepo fork)
└── packages/gl-react               # @react-native-ohos/gl-react (gl-react core alias package, pure JS)
    ├── src                         # gl-react core code (Shaders/GLSL/Node/Bus/Uniform/connectSize, etc.)
    ├── jtest                       # unit tests
    ├── example                     # RNOH verification project (with the harmony native project, 20 test cases)
    ├── react-native-ohos-gl-react-1.0.0-beta.1.tgz            # tgz of this package
    ├── react-native-ohos-gl-react-native-6.1.0-beta.1.tgz      # gl-react-native binding alias package tgz
    ├── react-native-ohos-expo-gl-1.0.0-beta.1.tgz              # expo-gl OpenHarmony adaptation tgz (with expo_gl.har)
    ├── react-native-ohos-expo-asset-1.0.0-beta.1.tgz           # expo-asset adaptation tgz
    ├── react-native-ohos-expo-modules-core-1.0.0-beta.1.tgz    # expo-modules-core adaptation tgz
    ├── README.md                   # Installation and usage (Chinese)
    └── README_EN.md                # Installation and usage (English)
````

## Contributing

If you encounter any problems during usage, feel free to submit an [Issue](https://github.com/react-native-oh-library/gl-react). Pull requests are also highly welcome via [PR](https://github.com/react-native-oh-library/gl-react/pulls).

## License

This project is based on [The MIT License (MIT)](https://github.com/gre/gl-react/blob/master/LICENSE). Enjoy and contribute to open source freely.
