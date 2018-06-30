'use strict';
const webpack = require('webpack')
const config = require('config');
const path = require('path');
const root = config.get('root'); // webpack want absolute path

// 如何把 webpack-dev-server 的 hot-load 通知到 node server
// http://www.boiajs.com/2015/08/25/webpack-dev-server-and-express-server
const webpackConfig = {
  module: {
    rules: [
      {
        test: /.*\.async$/,
        loader: 'async-loader',
      },
      {
        test: /\.(ts|tsx|js|jsx)?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
    ]
  },
  // http://www.ferecord.com/webpack-summary.html#resolve
  resolve: {
    extensions: [".ts", ".tsx", ".json", ".jsx", ".js"],
    alias: {
      '@src': path.resolve(root, './src'),
      '@client': path.resolve(root, './src/client'),
    }
  },
  resolveLoader: {
    modules: ['node_modules', 'loaders'],
  }
};

module.exports = webpackConfig;
