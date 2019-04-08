const fs = require('fs')

const open = require('open')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')

const webpackDev = require('../config/webpack.dev.js')
const paths = require('../config/paths')

const handlerCustomConfig = (baseConfig) => {
  const customConfig = paths.appCustomConfig

  if (!fs.existsSync(customConfig)) {
    return baseConfig
  }

  const customConfigModule = require(customConfig)
  const devConfigChain = customConfigModule.devConfigChain

  if (Object.prototype.toString.call(devConfigChain) !== '[object Function]') {
    return baseConfig
  }

  const ret = devConfigChain(baseConfig)

  return (typeof ret !== 'undefined' && ret !== null) ? ret : baseConfig
}

const start = () => {
  const webpackConfig = handlerCustomConfig(webpackDev)
  const devServerOptions = webpackConfig.devServer

  WebpackDevServer.addDevServerEntrypoints(webpackConfig, devServerOptions);

  const compiler = webpack(webpackConfig);
  const server = new WebpackDevServer(compiler, devServerOptions);

  server.listen(8080, devServerOptions.host, () => {
    console.log('dev server listening on port 8080');
    open(`http://${devServerOptions.host}:8080`)
  });
}

start()