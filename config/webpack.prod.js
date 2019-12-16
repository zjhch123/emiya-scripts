const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
const postcssImport = require('postcss-import');

const paths = require('./paths');
const config = require('./webpack.base.js')();

config.mode = 'production';

const commonStyleLoaders = [
  {
    loader: MiniCssExtractPlugin.loader,
    options: {
      publicPath: '../../',
    },
  },
  'css-loader',
  { 
    loader: require.resolve('postcss-loader'),
    options: { 
      ident: 'postcss',
      plugins: [
        autoprefixer(),
        postcssImport(),
        cssnano({
          safe: true,
          core: false,
        }),
      ],
    },
  },
];

config.module.rules.push({
  test: /\.css$/,
  use: commonStyleLoaders,
  exclude: /node_modules/,
});

config.module.rules.push({
  test: /\.scss$/,
  use: [
    ...commonStyleLoaders,
    require.resolve('sass-loader'),
  ],
  exclude: /node_modules/,
});

config.plugins.push(
  new CleanWebpackPlugin({
    dry: true,
    verbose: true,
    root: paths.appROOT,
  }),
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
