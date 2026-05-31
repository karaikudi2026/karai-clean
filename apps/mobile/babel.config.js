const { expoRouterBabelPlugin } = require("babel-preset-expo/build/expo-router-plugin");

/**
 * In npm workspaces, `expo-router` often resolves only from apps/mobile/node_modules.
 * babel-preset-expo checks for it from the hoisted preset path and skips the router
 * plugin — which breaks `require.context(process.env.EXPO_ROUTER_APP_ROOT)` on web.
 * Register the plugin explicitly here (reanimated must stay last).
 */
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [
        "babel-preset-expo",
        { unstable_transformImportMeta: true },
      ],
    ],
    plugins: [expoRouterBabelPlugin, "react-native-reanimated/plugin"],
  };
};
