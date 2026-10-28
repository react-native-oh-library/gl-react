module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  overrides: [
    {
      // RN 0.72 的 metro-react-native-babel-preset 给 flow-strip-types 不加
      // test（对其返回值里的首个 override 无条件生效，且先于 TS 插件），
      // 仓库根 src/*.tsx 的 `declare` 类字段会被它以 allowDeclareFields
      // 默认关闭为由拦下报错。这里对 TS 文件先跑一个开启 allowDeclareFields
      // 的实例（config 内插件先于 preset 插件执行），把 declare 字段删掉，
      // 与 TS 插件自身的处理一致；preset 里那个实例之后无 declare 可见。
      test: /\.tsx?$/,
      plugins: [
        ['@babel/plugin-transform-flow-strip-types', {allowDeclareFields: true}],
      ],
    },
  ],
};
