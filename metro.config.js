const { getDefaultConfig } = require('expo/metro-config')

const config = getDefaultConfig(__dirname)

// Allow bundling TensorFlow Lite models via `require('./model.tflite')`.
config.resolver.assetExts = [...config.resolver.assetExts, 'tflite']

module.exports = config

