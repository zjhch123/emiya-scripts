const open = require('open')
const webpack = require('webpack')
const webpackDevServer = require('webpack-dev-server')
const webpackDev = require('../config/webpack.dev.js')

const start = () => {
  const config = webpackDev
  const options = config.devServer

  webpackDevServer.addDevServerEntrypoints(config, options);
  const compiler = webpack(config);
  const server = new webpackDevServer(compiler, options);

  server.listen(8080, options.host, () => {
    console.log('dev server listening on port 8080');
    open(`http://${options.host}:8080`)
  });
}

module.exports = () => {
  start()
}