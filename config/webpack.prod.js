const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const paths = require('./paths');
const config = require('./webpack.base.js')(false);

config.plugins.push(
  new CleanWebpackPlugin(),
  new MiniCssExtractPlugin({
    filename: 'static/css/[name]-[hash].css',
    chunkFilename: 'static/css/[name]-[hash].css',
  }),
  new HtmlWebpackPlugin({
    inject: true,
    template: paths.appIndexHTML,
  }),
);

config.optimization.nodeEnv = 'production';

module.exports = config;
