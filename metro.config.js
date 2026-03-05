const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for framer-motion and tslib resolving
config.resolver.sourceExts = ['mjs', ...config.resolver.sourceExts];

// Add support for assets1 folder
config.resolver.assetExts.push(
  // Images
  'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg',
  // Videos
  'mp4', 'mov', 'avi', 'mkv',
  // Audio
  'mp3', 'wav', 'ogg'
);

module.exports = config;
