module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  transform: {"\\.ts$": ['ts-jest']},
  sourceMaps: true,
  plugins: [
    [
      '@babel/plugin-proposal-decorators',
      {
        legacy: true,
      },
    ],
  ],
};
