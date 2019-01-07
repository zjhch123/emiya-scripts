const webpack = require('webpack');
const path = require('path');
const address = require('address');
const paths = require('./paths');
const config = require('./webpack.base.js')();
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

config.mode = 'development'

config.output.publicPath = '/'

config.devServer = {
  historyApiFallback: true,
  overlay: true,
  stats: 'errors-only',
  contentBase: paths.appSrc,
  inline: true,
  hot: true,
  publicPath: '/',
  host: address.ip() || '0.0.0.0'
}

config.module.rules.push({
  test: /\.s?css$/,
  use: [
    'style-loader',
    'css-loader',
    { 
      loader: 'postcss-loader', 
      options: { 
        config: {
          path: path.resolve(__dirname, '..') 
        } 
      }
    },
    'sass-loader'
  ],
  exclude: /node_modules/
});

config.plugins.push(
  new webpack.HotModuleReplacementPlugin(),
  new webpack.SourceMapDevToolPlugin({
    filename: '[file].map',
    exclude: ['vendor.js']
  }),
  new HtmlWebpackPlugin({
    inject: true,
    template: paths.appIndexHTML,
  }),
  new FriendlyErrorsPlugin()
);

module.exports = config;