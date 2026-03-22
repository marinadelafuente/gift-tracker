module.exports = function (api) {
  api.cache(true);

  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // Required for React Native Reanimated.
      "react-native-reanimated/plugin",
      // Enables React Compiler transforms.
      "babel-plugin-react-compiler",
    ],
  };
};
