const path = require('path');
const paths = require('./paths');

module.exports = () => ({
  context: __dirname,
  resolve: {
    modules: ['node_modules'],
    alias: {
      '@css': paths.appCSS,
      '@js': paths.appJS,
      '@assets': paths.appAssets,
    }
  },
  entry: {
    index: paths.appIndexJS
  },
  output: {
    path: paths.appBuildPath,
    publicPath: './',
    filename: 'static/js/[name]-[hash].js',
    chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules|lib/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [ paths.appSrc ],
        options: {
          formatter: require('eslint-friendly-formatter'),
          configFile: path.resolve(__dirname, '../', '.eslintrc.js')
        }
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules|lib/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: [
              require('babel-preset-env'),
              require('babel-preset-stage-2'),
            ],
            plugins: [
              require("babel-plugin-add-module-exports"),
              [require("babel-plugin-transform-runtime"), {
                moduleName: path.resolve(__dirname, '..', 'node_modules', 'babel-runtime'),
              }],
              require.resolve("babel-plugin-transform-decorators-legacy"),
              [require("babel-plugin-transform-class-properties"), { loose: true }],
            ]
          }
        }]
      },
      {
        test: /\.html$/,
        exclude: /node_modules/,
        loader: 'html-loader'
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: 'static/images/[name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              mimetype: 'application/font-woff',
              name: 'static/fonts/[name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use:
        [
          {
            loader: 'file-loader',
            options:
            {
              limit: 8192,
              mimetype: 'application/font-woff',
              name: 'static/fonts/[name].[ext]'
            }
          }
        ]
      }
    ]
  },
  plugins: [],
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
})
