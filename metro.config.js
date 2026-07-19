const { getDefaultConfig } = require('expo/metro-config');
const exclusionList = require('@expo/metro/metro-config/defaults/exclusionList').default;

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Keep Windows file watching lighter — large/irrelevant folders often break watch mode.
config.resolver.blockList = exclusionList([
  /\.git\/.*/,
  /\.expo\/types\/.*/,
  /\.expo\/web\/cache\/.*/,
]);

config.watchFolders = [__dirname];

module.exports = config;
