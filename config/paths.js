'use strict';

const path = require('path');
const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
const appSrc = resolveApp('src')

/*
Emiya-Project
|-build
|-emiya.config.js
|-node_modules
|-src
  |-assets
  |-css
  |-js
  |-App.js
  |-index.html
*/

module.exports = {
  appROOT: resolveApp(''),
  appBuildPath: resolveApp('build'),
  appCustomConfig: resolveApp('emiya.config.js'),
  appNodeModules: resolveApp('node_modules'),
  
  appSrc: appSrc,
  appIndexHTML: path.join(appSrc, 'index.html'),
  appIndexJS: path.join(appSrc, 'App.js'),
  appCSS: path.join(appSrc, 'css'),
  appJS: path.join(appSrc, 'js'),
  appAssets: path.join(appSrc, 'assets'),
};
