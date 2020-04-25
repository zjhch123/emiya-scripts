const paths = require('./paths');

const devServerDefaultHost = '0.0.0.0';

const devServerConfig = () => ({
  compress: true,
  historyApiFallback: true,
  overlay: true,
  stats: 'errors-only',
  contentBase: paths.appSrc,
  inline: true,
  watchContentBase: true,
  hot: true,
  publicPath: '/',
  quiet: true,
  host: process.env.HOST || devServerDefaultHost,
});

module.exports = {
  devServerConfig,
  devServerDefaultHost,
};
