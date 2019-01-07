const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const paths = require('./paths');
const config = require('./webpack.base.js')();

config.mode = 'production'

config.module.rules.push({
  test: /\.s?css$/,
  use: [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        publicPath: '../../',
      }
    },
    'css-loader',
    { 
      loader: 'postcss-loader', 
      options: { 
        config: {
          path: path.resolve(__dirname, '..') 
        } 
      }
    },
    'sass-loader',
  ],
  exclude: /node_modules/
});

config.plugins.push(
  new CleanWebpackPlugin(['build'], {
    verbose: false,
    root: paths.appROOT
  }),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
  }),
  new webpack.LoaderOptionsPlugin({minimize: true}),
  new MiniCssExtractPlugin({
    filename: 'static/css/[name]-[hash].css',
    chunkFilename: 'static/css/[name]-[hash].css',
  }),
  new HtmlWebpackPlugin({
    inject: true,
    template: paths.appIndexHTML
  })
);


module.exports = config;
