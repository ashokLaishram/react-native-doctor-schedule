module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // ... any other plugins you might have
      "react-native-reanimated/plugin", // This MUST be last
    ],
  };
};
