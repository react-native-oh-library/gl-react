> Document Template: v0.4.2

<p align="center">
  <h1 align="center"> <code>gl-react</code> </h1>
</p>

This project is based on [gl-react](https://github.com/gre/gl-react) and is the OpenHarmony adaptation of gl-react for React Native.

The OpenHarmony-adapted tgz packages of this library can be downloaded directly from the repository. The version mapping is as follows:

| Library Name    | Version    | Release Info     | RN Version Supported    | Autolink     | API Version     | Community Baseline    |  Source Code   |
| ------------ | ------------ | ------------------------------ | ------------- | ------------- |------------------------ | ------------- | ------------- |
| @react-native-ohos/gl-react-native | [~ 6.1.0-beta.1](https://github.com/tyBrave/gl-react/tree/master/packages/gl-react-native) | [Releases](https://github.com/tyBrave/gl-react/releases) | 0.72.* | Yes | API13+ | 6.1.0 | [br_rnoh0.72](https://github.com/tyBrave/gl-react/tree/master/packages/gl-react-native) |
| @react-native-ohos/gl-react | [~ 1.0.0-beta.1](https://github.com/tyBrave/gl-react/tree/master/packages/gl-react) | [Releases](https://github.com/tyBrave/gl-react/releases) | 0.72.* | Yes | API13+ | 6.0.0 | [br_rnoh0.72](https://github.com/tyBrave/gl-react/tree/master/packages/gl-react) |
| @react-native-ohos/expo-gl | [~ 1.0.0-beta.1](https://github.com/tyBrave/expo/tree/main/packages/expo-gl) | [Releases](https://github.com/tyBrave/expo/releases) | 0.72.* | Yes | API13+ | 58.0.3 | [main](https://github.com/tyBrave/expo/tree/main/packages/expo-gl) |

## Introduction

gl-react is a generic React library to write and compose WebGL shaders.

The OpenHarmony adaptation consists of community npm packages (`gl-react`, `gl-react-native`, `gl-react-expo`) and OpenHarmony-adapted packages (`@react-native-ohos/gl-react`, `@react-native-ohos/gl-react-native`, `@react-native-ohos/expo-gl`):

- `@react-native-ohos/gl-react`: alias package of the gl-react core (pure JS, redirected automatically by metro via `harmony.alias`), providing platform-agnostic core APIs such as `Shaders`/`GLSL`/`Node`/`Bus`/`LinearCopy`/`NearestCopy`/`Uniform`/`connectSize`;
- `@react-native-ohos/gl-react-native`: alias package of the gl-react-native binding (pure JS), providing `Surface` (mounted onto expo-gl via the official gl-react-expo binding);
- `@react-native-ohos/expo-gl`: OpenHarmony native GL capability (JS entry + `harmony/expo_gl.har`). The native side is ExpoGLView (XComponent + EGL + GLES3), exposing a WebGL 2.0 semantic subset plus extensions such as `endFrameEXP`;
- `@react-native-ohos/expo-asset` / `@react-native-ohos/expo-modules-core`: adapted stubs for `require()` texture asset delivery into the sandbox and native module loading.

**Zero changes** are required in business code: keep `import { Surface } from "gl-react-native"` and `import { Node, Shaders, GLSL, Bus, Uniform } from "gl-react"` as usual; metro redirects to the OpenHarmony-adapted packages automatically.

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

> [!TIP] This library is currently distributed as tgz packages from the source repository (see "Source Code" column above). Place them into your project and install with `file:` dependencies, together with `@react-native-ohos/gl-react`, `@react-native-ohos/expo-gl`, `@react-native-ohos/expo-asset` and `@react-native-ohos/expo-modules-core` (see the mapping below). `gl-react` and `gl-react-expo` use the official npm versions (`^6.0.0`) directly.

## Dependencies (keep this section if applicable, otherwise remove it)

Choose the library versions matching the RN framework version of your application project:

| RN Framework Version | OpenHarmony-adapted Library | Supported Version Range |
| --- | --- | --- |
| 0.72 | @react-native-ohos/gl-react-native | ~6.1.0-beta.1 |
| | @react-native-ohos/gl-react | ~1.0.0-beta.1 |
| | @react-native-ohos/expo-gl | ~1.0.0-beta.1 |
| | @react-native-ohos/expo-asset | ~1.0.0-beta.1 |
| | @react-native-ohos/expo-modules-core | ~1.0.0-beta.1 |

The OpenHarmony implementation of this library depends on the adapted libraries above. If they are already included in your OpenHarmony application project, skip this section.

> [!TIP] Make sure the library versions match the RN framework version of the project; mismatched versions may cause build or runtime failures.

## Link

|                                      | Autolink Supported | RN Framework Version |
|--------------------------------------|----------------|-----------|
| ~ 6.1.0-beta.1                       | Yes            |  0.72     |
| ~ 1.0.0-beta.1                       | Yes            |  0.72     |

Projects using AutoLink should follow this guide: https://gitcode.com/openharmony-sig/ohos_react_native/blob/master/docs/zh-cn/Autolinking.md

If your version supports Autolink and the project has integrated Autolink, skip the ManualLink configuration.
<details>
  <summary>ManualLink: guidance for manually configuring native dependencies</summary>

Open the HarmonyOS project `harmony` with DevEco Studio.

The native side depends on the har of `@react-native-ohos/expo-gl` (located in the `harmony` folder of the installed package). Open `entry/oh-package.json5` and add:

```json
"dependencies": {
    "@react-native-ohos/expo-gl": "file:../../node_modules/@react-native-ohos/expo-gl/harmony/expo_gl.har"
  }
```

Add the corresponding dependency in `harmony/oh-package.json5` as well (`file:../node_modules/...`), according to the actual path.

> [!TIP] RNOH autolinking generates/overwrites `entry/src/main/cpp/autolinking.cmake` and `RNPackagesFactory.h` at build time and registers ExpoGlPackage (including the ExpoGLView component and the ExpoGL/ExpoAsset TurboModules) automatically. **No manual changes to CMakeLists / PackageProvider / RNPackagesFactory are required.**
</details>

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

1. RNOH: 0.72.x (RN 0.72.5); SDK: HarmonyOS SDK (API 13+); IDE: DevEco Studio 5.0+ / 6.0+; ROM: HarmonyOS 6.0;

### Permission Requirements

Network textures (`http(s)://`) require declaring `ohos.permission.INTERNET` in `entry/src/main/module.json5` (a normal-level permission; no runtime request needed). Pure local rendering and snapshot export require no permissions.

```json
"requestPermissions": [
  {
    "name": "ohos.permission.INTERNET",
  },
],
```

### Resource File Placement

To use local images bundled in the HAP via `require()` (PNG/JPEG) as shader textures, the resource is delivered into the application sandbox via ExpoAsset and decoded/uploaded natively; no extra placement into rawfile is needed. For rawfile resources, place files under `entry/src/main/resources/rawfile` of the HarmonyOS project and reference them as `resource://RAWFILE/<relative path>` (e.g. `resource://RAWFILE/assets/img1.png`).

### Compilation and API Requirements (keep this section if applicable, otherwise remove it)

> [!TIP] All current versions of this library implement version isolation: they can be compiled on `API13+` projects and run on `API13+` ROMs.

## Usage Example

The following code shows the basic usage scenario:

> [!WARNING] The import names stay unchanged (`gl-react-native` / `gl-react`); on OpenHarmony metro redirects them to the adapted packages automatically.

### Basic Example

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

### Image Texture Example

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

> [!TIP] Pass image textures in URI form (`require()` asset numbers, `{uri}`, `http(s)://`, `file://`, `data:`); they are decoded via Image Kit / stb and uploaded. **Decoding supports PNG/JPEG only; WebP is not supported.**

## API Description

> [!TIP] The "Platform" column indicates the platforms supported by the original library.

> [!TIP] In the "HarmonyOS Support" column, **yes** means the property/interface is supported on OpenHarmony; **no** means not supported (including both "upstream Web/iOS-only" and "not verified" cases; the latter is noted in the description). Usage is cross-platform and consistent, with results aligned to iOS or Android.

### Components

| Name       | Parameter Type     | Required  | Platform  | OpenHarmony Support | Description |
|------------|------------|----------------------|------|-----|----------------|
| Surface | [SurfaceProps](#surfaceprops) | yes | all | yes | GL rendering surface component; size set via style; hosts the WebGL context and the root Node tree |
| Node | [NodeProps](#nodeprops) | yes | all | yes | Shader node component; nestable (child Node output textures feed parent Node uniforms) |
| Bus | [BusProps](#busprops) | No | all | yes | Texture bus to share one computation across multiple consumers |
| LinearCopy / NearestCopy | — | No | all | yes | Texture copy rendering containers (linear / nearest sampling) |
| Shaders | static registrar | yes | all | yes | `Shaders.create({ name: GLSL\`...\` })` pre-registers shaders |
| GLSL | tagged template | GLSL source string | No | all | yes | Tagged template literal for fragment shaders |
| Uniform | constants/factories | No | all | yes | Declarative special uniforms (Backbuffer, Resolution, etc.) |
| connectSize | HOC | component | No | all | yes | Injects the Surface GL size into business component props (width/height) |
| createSurface | factory | ({GLView, ...}) | Surface component | No | all | yes | Platform binding factory (used internally by the adaptation) |
| listSurfaces | function | / | Surface list | No | all | yes | Enumerates all current Surface instances (debugging) |
| Visitor / VisitorLogger / Visitors | debug visitors | / | / | No | all | yes | Draw lifecycle observers |
| Backbuffer (string constant) | constant | / | / | No | all | no | Legacy form, equivalent to `Uniform.Backbuffer`; emits a deprecation warning (not verified) |

### Props

**SurfaceProps**

| Name                           | Parameter Type          | Default Value       | Required            | Platform   | OpenHarmony Support    | Description |
|------------------------------|--------------------|------------|---------------|------|------------------|---------------|
| children | ReactNode | None | yes | All | yes | GL tree; must contain a discoverable root Node (drawn directly onto the Surface canvas) |
| style | StyleProp\<ViewStyle\> | None | No | All | yes | Container style; width/height determine the drawingBuffer size (pixel density applies, e.g. ×3.5) |
| preload | Array\<any\> | None | No | All | yes | Texture resources to preload before GL is ready (require() assets / {uri}); onLoad fires only after all complete |
| onLoad | Function | None | No | All | yes | Callback after the GL context is ready, preload completes and the first frame is drawn |
| onLoadError | Function | None | No | All | yes | Callback for GL creation/preload failure, receives an Error |
| onContextLost | Function | None | No | All | no | Web-semantics event; never fires on expo-gl native platforms (iOS/Android/OpenHarmony alike) |
| onContextRestored | Function | None | No | All | no | Same as above |
| visitor | VisitorLike \| VisitorLike[] | None | No | All | yes | Mounts draw debugging visitors |
| Other ViewProps | ViewProps | None | No | All | yes | Unrecognized props are passed through to the underlying GLView |

**NodeProps**

| Name                           | Parameter Type          | Default Value       | Required            | Platform   | OpenHarmony Support    | Description |
|------------------------------|--------------------|------------|---------------|------|------------------|---------------|
| shader | ShaderIdentifier \| {frag, vert?} | None | yes | All | yes | Key from `Shaders.create` or inline definition; vert defaults to the built-in fullscreen triangle |
| uniforms | object | {} | No | All | yes | Uniform values: numbers/arrays/vecs, sampler2D (require() assets, {uri}, Node, Bus, Uniform.*) |
| uniformsOptions | object | {} | No | All | yes | Texture uniform sampling options: interpolation (linear/nearest), wrap (clamp to edge/repeat/mirrored repeat) |
| ignoreUnusedUniforms | string[] \| boolean | — | No | All | yes | Suppresses "uniform not declared in shader" warnings |
| sync | boolean | false | No | All | yes | Draws synchronously right after props update (without waiting for the next frame) |
| width / height | number | inherited parent GL size | No | All | yes | Non-root nodes: their FBO size; root node must match the Surface size |
| children | ReactNode | — | No | All | yes | Child Nodes/Buses forming the render graph |
| backbuffering | boolean | false | No | All | yes | Enables double-FBO backbuffer (for Uniform.Backbuffer); immutable after mount; not supported on root nodes |
| blendFunc | {src, dst} | regular alpha blending | No | All | yes | Blending equation; all aliases including zero/one/src alpha available (with the zero guard fix) |
| clear | {color: [r,g,b,a]} \| null | {color:[0,0,0,0]} | No | All | yes | Clear color before drawing; null means no clear (for compositing) |
| onDraw | Function | None | No | All | yes | Callback after each actual draw |

**BusProps**

| Name                           | Parameter Type          | Default Value       | Required            | Platform   | OpenHarmony Support    | Description |
|------------------------------|--------------------|------------|---------------|------|------------------|---------------|
| children | ReactElement \| (redraw) => ReactElement | — | yes | All | yes | Content being reused (Node tree, etc.); function children receive redraw |
| uniform | string | — | No | All | yes | Which sampler2D uniform of the parent Node to attach to (must be inside a Node) |
| index | number | 0 | No | All | yes | Index when the uniform is a texture array |

### APIs

**Surface instance methods (ref)**

| Name     | Type     | Parameter Type | Return Value | Required    | Platform | OpenHarmony Support | Description  |
|--------|---------|-----|-------|-------|--------|-----|-----------------|
| capture | function | (x?, y?, w?, h?) | NDArray | No | All | yes | Pixel readback (native synchronous readPixels): full canvas or region; delegates to the root Node internally |
| redraw | function | / | void | No | All | yes | Marks dirty, redraws on the next frame |
| flush | function | / | void | No | All | yes | Performs one draw synchronously |
| glIsAvailable | function | / | boolean | No | All | yes | Whether the GL context is alive |
| getGLSize | function | / | [w, h] | No | All | yes | drawingBuffer size; frozen at context creation, does not follow later layout changes |
| rebootForDebug | function | / | void | No | All | yes | For debugging: remounts the GLView entirely, destroys and recreates the context; rendering/readback recover afterwards. Note: on multi-Node trees the remount order may flip (a child becoming root first triggers an invariant); use with care on complex trees |
| captureAsDataURL | function | ({format, quality}) | Promise\<string\> | No | All | no | Upstream implements this on Web only; the RN GLView lacks this API. Use GLView.takeSnapshotAsync on OpenHarmony instead |
| captureAsBlob | function | ({format, quality}) | Promise\<Blob\> | No | All | no | Same as above |

**Node instance methods (ref)**

| Name     | Type     | Parameter Type | Return Value | Required    | Platform | OpenHarmony Support | Description  |
|--------|---------|-----|-------|-------|--------|-----|-----------------|
| capture | function | (x?, y?, w?, h?) | NDArray | No | All | yes | Reads this Node's pixels (readPixels): works for the root full canvas and offscreen child Node FBOs |
| redraw / flush | function | / | void | No | All | yes | Marks dirty / draws immediately |
| setDrawProps | function | Partial\<Props\> | void | No | All | yes | Imperative partial props update |
| getGLOutput | function | / | WebGLTexture | No | All | yes | This Node's FBO color texture (not available on root Nodes) |
| getGLBackbufferOutput | function | / | WebGLTexture | No | All | yes | The backbuffer texture (requires backbuffering) |
| getGLSize | function | / | [w, h] | No | All | yes | This Node's size |

**GLView static methods (expo-gl; created internally by Surface; usable directly for headless / advanced scenarios)**

| Name     | Type     | Parameter Type | Return Value | Required    | Platform | OpenHarmony Support | Description  |
|--------|---------|-----|-------|-------|--------|-----|-----------------|
| takeSnapshotAsync | function | (gl \| ctxId, options?) | Promise\<GLSnapshot\> | No | All | yes | Saves a snapshot into the application sandbox cacheDir, returning {uri, localUri, width, height}; the uri can feed \<Image\> or serve as a texture input again. format supports jpeg/png/webp (webp falls back to png with a warning); flip/rect/compress/framebuffer all usable |
| createContextAsync | function | / | Promise\<gl\> | No | All | yes | Creates a headless context (no view); call gl.flushEXP() before takeSnapshotAsync (headless has no render loop; without flush it fails with E_GL_NO_FRAMEBUFFER) |
| destroyContextAsync | function | (gl \| ctxId) | Promise\<boolean\> | No | All | yes | Destroys a headless context |
| getWorkletContext | function | (ctxId) | gl \| undefined | No | iOS/Android | no | Getting the context inside a Reanimated worklet thread; not verified on OpenHarmony (requires the Reanimated OpenHarmony adapter dependency), treated as unsupported |

**GL context extensions (EXGL, available on the gl received by onContextCreate)**

| Name     | Type     | Parameter Type | Return Value | Required    | Platform | OpenHarmony Support | Description  |
|--------|---------|-----|-------|-------|--------|-----|-----------------|
| endFrameEXP | function | / | void | No | All | yes | Ends the current frame and presents it (called automatically by Surface each frame) |
| flushEXP | function | / | void | No | All | yes | Submits the command queue; must be called manually in headless scenarios |
| getExtension("GLViewRef") | function | name | ref | No | RN platforms | yes | Gets the underlying GLView reference (used internally by gl-react-expo) |
| drawingBufferWidth / drawingBufferHeight | property | / | number | No | All | yes | Canvas pixel size; frozen at context creation, does not follow layout updates (correct orientation, no transpose) |
| getExtension (other extensions) | function | name | object \| null | No | All | no | Driver extensions are not bridged as WebGL extensions; returns null with a warning |
| getParameter (range/string pnames) | function | pname | number | No | All | no | Only numeric scalar pnames work; range/string pnames return -1 or 0 |
| texImage2D six-argument DOM-source form | function | six args | void | No | All | no | No browser semantics; use the texture loader URI path (nine-argument full form) |

**Uniform special values**

| Name     | Type     | Parameter Type | Return Value | Required    | Platform | OpenHarmony Support | Description  |
|--------|---------|-----|-------|-------|--------|-----|-----------------|
| Uniform.Backbuffer | symbol value | / | / | No | All | yes | Injects this Node's previous-frame framebuffer (requires backbuffering) |
| Uniform.backbufferFrom | factory | (node \| bus) | object | No | All | yes | Injects a specified Node's backbuffer |
| Uniform.Resolution | symbol value | / | / | No | All | yes | Injects this Node's size [width, height] |
| Uniform.textureSize | factory | (texture) | object | No | All | yes | Injects a texture input's [w, h] |
| Uniform.textureSizeRatio | factory | (texture) | object | No | All | yes | Injects a texture input's aspect ratio w / h |

**Texture input support**

| Input Form | Parameter Type | Required | Platform | OpenHarmony Support | Description |
|---|---|---|---|---|---|
| require("./img.png") | number (asset id) | — | All | yes | Delivered into the sandbox via ExpoAsset, decoded and uploaded natively; PNG/JPEG only |
| {uri: "https://..."} | {uri: string} | — | All | yes | Remote texture; requires network access + ohos.permission.INTERNET |
| {uri: "file://..."} | {uri: string} | — | All | yes | Sandbox files (e.g. GLSnapshot localUri fed back); PNG/JPEG only |
| \<Node\> / \<Bus\> output | instance | — | All | yes | FBO texture used directly as a sampler2D input |
| WebP images | — | — | — | no | Native stb decoding supports PNG/JPEG only |

### Platform Differences

- **Frame retention**: The implementation always retains the last frame (a superset of WebGL `preserveDrawingBuffer: true`); `capture`/snapshot export always reads valid pixels.
- **Synchronous queries**: `getShaderParameter`/`getUniformLocation`/`getUniform` etc. submit queued commands first, then execute synchronously on the native side, consistent with WebGL ordering semantics.
- **Snapshot formats**: `format: 'image/jpeg'` has no pure native JPEG encoding entry and falls back to PNG (identical pixel content, only the container differs); `webp` falls back to `png` with a warning.
- **Context lifecycle**: Surface destruction caused by page switching is no longer treated as context loss (GL resources survive across surfaces).

## Usage Notes

- The shader language is GLSL ES 3.00 (WebGL2 semantics); the actually available capability follows the OpenHarmony EXGL WebGL 2.0 subset (the demos cover common built-in functions/uniforms/texture syntax).
- GL calls are batched in JS and dispatched cross-language once per frame; example scales (≤10 nodes) run smoothly.
- Remote texture (`http(s)://`) failures go through `onLoadError` without blocking other rendering.
- One Surface per screen is recommended; multiple Surfaces can coexist on screen (3 tested in demos), but concurrent stability is not stress-tested.

## Known Issues

- [ ] WebGL extensions are not bridged (`getExtension` returns null); capabilities like float linear filtering rely on the built-in uint8 fallback path.
- [ ] `image/jpeg` snapshots fall back to PNG (identical pixel content, only the container differs); `webp` snapshots fall back to `png` likewise.
- [ ] The six-argument DOM/ImageSource source form of `gl.texImage2D` is not supported.
- [ ] WebP image textures are not supported (native decoding supports PNG/JPEG only).
- [ ] `captureAsDataURL` / `captureAsBlob` are upstream Web-only implementations and are not provided on OpenHarmony (use `takeSnapshotAsync` / `capture`).
- [ ] Reanimated worklet GL access (`enableExperimentalWorkletSupport` / `getWorkletContext`) is not verified and treated as unsupported.
- [ ] `msaaSamples` (GLView prop) is upstream iOS-only; the value is ignored on OpenHarmony.
- [ ] Concurrent rendering of multiple Surfaces on one screen is not stress-tested.

## Others

### Differences from the Original Library

- Declarative usage is fully consistent with gl-react-native; rendering is executed by the native ExpoGLView layer (XComponent + EGL + GLES3). The `gl` received by `onContextCreate` is a WebGL 2.0 semantic subset proxy (batched dispatch; synchronous queries execute in order on the native side).
- Snapshot formats: there is currently no pure native JPEG encoding entry, so `format: 'image/jpeg'` snapshot requests fall back to PNG; the pixel content is identical, only the container differs.
- WebGL extensions: the OpenHarmony GLES driver does not expose the WebGL extension surface; `getExtension` returns null.
- Verified fixes: the `blendFunc` `zero` guard (no longer silently dropping blend due to a false missing-argument report), the GL context lifecycle memory leak, and the drawingBuffer width/height transpose (`SET_BUFFER_GEOMETRY` argument order).

## Directory Structure

````
/gl-react                           # project root (upstream monorepo fork)
└── packages/gl-react               # @react-native-ohos/gl-react package (gl-react core alias package, pure JS)
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

If you encounter any problems during usage, feel free to submit an [Issue](https://github.com/tyBrave/gl-react/issues). Pull requests are also highly welcome via [PR](https://github.com/tyBrave/gl-react/pulls).

## License

This project is based on the original library [gl-react](https://github.com/gre/gl-react) under [The MIT License (MIT)](./LICENSE). Enjoy and contribute to open source freely.
