const webpack = require('webpack');
const address = require('address');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
const postcssImport = require('postcss-import');

const paths = require('./paths');
const config = require('./webpack.base.js')();

const commonStyleLoaders = [
  require.resolve('style-loader'),
  require.resolve('css-loader'),
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
      ]
    },
  },
];

config.mode = 'development';

config.output.publicPath = '/';

config.devServer = {
  historyApiFallback: true,
  overlay: true,
  stats: 'errors-only',
  contentBase: paths.appSrc,
  inline: true,
  hot: true,
  publicPath: '/',
  host: address.ip() || '0.0.0.0',
},

config.module.rules.push({
  test: /\.scss$/,
  use: [
    ...commonStyleLoaders,
    require.resolve('sass-loader'),
  ],
  exclude: /node_modules/,
});

config.module.rules.push({
  test: /\.css$/,
  use: commonStyleLoaders,
  exclude: /node_modules/,
});

config.plugins.push(
  new webpack.HotModuleReplacementPlugin(),
  new webpack.SourceMapDevToolPlugin({
    filename: '[file].map',
    exclude: ['vendor.js'],
  }),
  new HtmlWebpackPlugin({
    inject: true,
    template: paths.appIndexHTML,
  }),
  new FriendlyErrorsPlugin(),
);

config.optimization.nodeEnv = 'development';

module.exports = config;