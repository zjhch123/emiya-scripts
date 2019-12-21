const path = require('path')
const PnpWebpackPlugin = require('pnp-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const postcssNormalize = require('postcss-normalize')
const paths = require('./paths')

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

const getStyleLoaders = ({ cssOptions, shouldUseSourceMap = false, shouldUseProcessor = false }) => {
  const loaders = [
    isDev && require.resolve('style-loader'),
    isProd && {
      loader: MiniCssExtractPlugin.loader,
      options: {
        publicPath: '../../',
      },
    },
    { 
      loader: require.resolve('css-loader'),
      options: cssOptions
    },
    { 
      loader: require.resolve('postcss-loader'),
      options: {
        ident: 'postcss',
        plugins: () => [
          require('postcss-flexbugs-fixes'),
          require('postcss-preset-env')({
            autoprefixer: {
              flexbox: 'no-2009',
            },
            stage: 3,
          }),
          postcssNormalize(),
        ],
        sourceMap: isProd && shouldUseSourceMap,
      }
    },
  ].filter(Boolean)

  if (shouldUseProcessor) {
    loaders.push({
      loader: require.resolve('resolve-url-loader'),
      options: {
        sourceMap: isProd && shouldUseSourceMap,
      },
    }, {
      loader: require.resolve('sass-loader'),
      options: {
        sourceMap: true,
      },
    })
  }

  return loaders
}

module.exports = () => ({
  mode: isDev ? 'development' : 'production',
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
      { parser: { requireEnsure: false } },
      {
        test: /\.js$/,
        exclude: /\.lib\.js$/,
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
        oneOf: [
          {
            test: /\.html$/,
            include: paths.appSrc,
            loader: require.resolve('html-loader'),
          },
          {
            test: /\.(png|jpg|gif|svg|bmp)$/,
            use: [
              {
                loader: require.resolve('url-loader'),
                options: {
                  limit: 8192,
                  name: 'static/images/[name].[ext]',
                  esModule: false,
                },
              },
            ],
          },
          {
            test: /\.lib\.js$/,
            include: paths.appSrc,
            loader: require.resolve('script-loader'),
          },
          {
            test: /\.js$/,
            exclude: /\.lib\.js$/,
            include: paths.appSrc,
            use: [{
              loader: require.resolve('babel-loader'),
              options: {
                presets: [
                  [require.resolve('@babel/preset-env'), {
                    useBuiltIns: 'usage',
                    corejs: {
                      version: 3,
                      proposals: false,
                    },
                  }],
                ],
              },
            }],
          },
          {
            test: /\.css$/,
            use: getStyleLoaders({
              cssOptions: {
                importLoaders: 1,
              },
              shouldUseSourceMap: isProd,
            }),
            sideEffects: true,
          },
          {
            test: /\.scss$/,
            use: getStyleLoaders({
              cssOptions: {
                importLoaders: 2,
              },
              shouldUseSourceMap: isProd,
              shouldUseProcessor: true,
            }),
            sideEffects: true,
          },
          {
            loader: require.resolve('file-loader'),
            exclude: [/\.s?css$/, /\.js$/, /\.lib\.js$/, /\.(png|jpg|gif|svg|bmp)$/, /\.html$/],
            options: {
              name: 'static/assets/[name].[ext]',
            },
          },
        ]
      },
    ],
  },
  plugins: [],
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
})
