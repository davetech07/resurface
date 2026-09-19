const { getDefaultConfig } = require("@expo/metro-config");

const config = getDefaultConfig(__dirname);

// Add wasm asset support (keep this from before, harmless either way)
config.resolver.assetExts.push("wasm");

// Only build for native platforms — skip web entirely, since expo-sqlite's
// web implementation is still experimental and we're not targeting web.
config.resolver.platforms = ["ios", "android", "native"];

module.exports = config;
