const path = require('path');
const PnpWebpackPlugin = require('pnp-webpack-plugin');
const paths = require('./paths');

console.log(paths.appNodeModules)

module.exports = () => ({
  resolve: {
    modules: ['node_modules', paths.appNodeModules],
    plugins: [
      PnpWebpackPlugin,
    ],
    alias: {
      '@css': paths.appCSS,
      '@js': paths.appJS,
      '@assets': paths.appAssets,
    },
  },
  resolveLoader: {
    plugins: [
      PnpWebpackPlugin.moduleLoader(module),
    ],
  },
  entry: {
    index: paths.appIndexJS,
  },
  output: {
    path: paths.appBuildPath,
    publicPath: './',
    filename: 'static/js/[name]-[hash].js',
    chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.lib\.js$/,
        include: paths.appSrc,
        loader: require.resolve('script-loader'),
      },
      {
        test: /\.jsx?$/,
        exclude: /\.lib\.jsx?$/,
        include: paths.appSrc,
        enforce: 'pre',
        options: {
          cache: true,
          resolvePluginsRelativeTo: __dirname,
          formatter: require.resolve('eslint-friendly-formatter'),
          configFile: path.resolve(__dirname, '../', '.eslintrc.js'),
        },
        loader: require.resolve('eslint-loader'),
      },
      {
        test: /\.jsx?$/,
        exclude: /\.lib\.jsx?$/,
        include: paths.appSrc,
        use: [{
          loader: require.resolve('babel-loader'),
          options: {
            presets: [
              require.resolve('@babel/preset-env'),
            ],
            plugins: [],
          },
        }],
      },
      {
        test: /\.html$/,
        exclude: /node_modules/,
        loader: require.resolve('html-loader'),
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: require.resolve('url-loader'),
            options: {
              limit: 8192,
              name: 'static/images/[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: require.resolve('url-loader'),
            options: {
              limit: 8192,
              mimetype: 'application/font-woff',
              name: 'static/fonts/[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use:
        [
          {
            loader: require.resolve('file-loader'),
            options:
            {
              limit: 8192,
              mimetype: 'application/font-woff',
              name: 'static/fonts/[name].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [],
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
});
