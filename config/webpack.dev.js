const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const { devServerConfig } = require('./webpack.dev-server');
const paths = require('./paths');
const config = require('./webpack.base.js')(true);

config.output.publicPath = '/';

config.devServer = devServerConfig();

config.plugins.push(
  new webpack.HotModuleReplacementPlugin(),
  new HtmlWebpackPlugin({
    inject: true,
    template: paths.appIndexHTML,
  }),
  new FriendlyErrorsPlugin(),
);

config.optimization.nodeEnv = 'development';

module.exports = config;
