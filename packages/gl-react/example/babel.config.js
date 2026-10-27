module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  overrides: [
    {
      // RN 0.72 的 metro-react-native-babel-preset 中 flow-strip-types 无
      // test 且先于 TS 插件执行，会拦下 src/*.tsx 的 declare 类字段报错；
      // 这里对 TS 文件先以 allowDeclareFields 跑一遍，把字段声明删掉。
      test: /\.tsx?$/,
      plugins: [
        ['@babel/plugin-transform-flow-strip-types', {allowDeclareFields: true}],
      ],
    },
  ],
};
