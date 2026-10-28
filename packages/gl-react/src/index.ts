/**
 * MIT License
 *
 * Copyright (C) 2026 Huawei Device Co., Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom it is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OR CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * @react-native-ohos/gl-react — gl-react 核心（鸿蒙修复版）。
 *
 * 入口对齐官方 gl-react 6.0.0 的平台无关核心：Shaders / GLSL / Node / Bus /
 * LinearCopy / NearestCopy / createSurface…。Surface / GLView 等平台绑定由
 * gl-react-native（→ gl-react-expo → expo-gl）提供，鸿蒙侧由
 * @react-native-ohos/gl-react-native 与 @react-native-ohos/expo-gl 承接，
 * 本包不含任何原生依赖（harmony.alias 将 'gl-react' 重定向至此）。
 *
 * 相对官方 6.0.0 的源码修复（见仓库根 FIXES.md），如 Node.tsx 的
 * blendFunc 守卫不再把合法的 gl.ZERO(=0) 误判为缺参。
 */
import Bus from "./Bus";
import connectSize from "./connectSize";
import createSurface, { list as listSurfaces } from "./createSurface";
import GLSL from "./GLSL";
import LinearCopy from "./LinearCopy";
import NearestCopy from "./NearestCopy";
import Node from "./Node";
import Uniform from "./Uniform";
import Visitor from "./Visitor";
import VisitorLogger from "./VisitorLogger";
import Visitors from "./Visitors";

export {
  Bus,
  connectSize,
  createSurface,
  listSurfaces,
  GLSL,
  LinearCopy,
  NearestCopy,
  Node,
  Uniform,
  Visitor,
  VisitorLogger,
  Visitors,
};

export {
  default as Shaders,
  isShaderIdentifier,
  ensureShaderDefinition,
  shaderDefinitionToShaderInfo,
  shaderInfoEquals,
} from "./Shaders";

// DEPRECATED
export const Backbuffer = "Backbuffer";

export type SurfaceType = ReturnType<typeof createSurface>;
