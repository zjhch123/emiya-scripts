const webpack = require('webpack')
const path = require('path')
const fs = require('fs')
const gzipSize = require('gzip-size').sync
const filesize = require('filesize')
const chalk = require('chalk')
const ora = require('ora')
const webpackProd = require('../config/webpack.prod.js')
const paths = require('../config/paths')

const handlerCustomConfig = (baseConfig) => {
  const customConfig = paths.appCustomConfig

  if (!fs.existsSync(customConfig)) {
    return baseConfig
  }

  const customConfigModule = require(customConfig)
  const prodConfigChain = customConfigModule.prodConfigChain

  if (Object.prototype.toString.call(prodConfigChain) !== '[object Function]') {
    return baseConfig
  }

  const ret = prodConfigChain(baseConfig)

  return (typeof ret !== 'undefined' && ret !== null) ? ret : baseConfig
}

const printFileSizes = (stats, config) => {
  const outputPath = config.output.path;
  const assets = stats.toJson().assets.map((asset) => {
    const fileContents = fs.readFileSync(path.join(outputPath, asset.name));
    const size = gzipSize(fileContents);
    return {
      name: path.basename(asset.name),
      size,
      sizeLabel: filesize(size),
    };
  });
  assets.sort((a, b) => b.size - a.size);
  const longestSizeLabelLength = Math.max.apply(null, assets.map(a => a.sizeLabel.length));

  console.log('\nAfter gzip size:');
  assets.forEach((asset) => {
    let sizeLabel = asset.sizeLabel;
    const sizeLength = sizeLabel.length;
    if (sizeLength < longestSizeLabelLength) {
      const rightPadding = ' '.repeat(longestSizeLabelLength - sizeLength);
      sizeLabel += rightPadding;
    }
    const dirname = path.relative('', outputPath);
    console.log(`  ${sizeLabel}  ${chalk.dim(dirname + path.sep)}${chalk.cyan(asset.name)}`);
  });
}

const start = () => {
  const spinner = ora(`building for production...`);
  const webpackConfig = handlerCustomConfig(webpackProd)

  spinner.start();
  webpack(webpackConfig, (err, stats) => {
    if (err) {
      console.error(err.stack || err);
      if (err.details) {
        console.error(err.details);
      }
      spinner.warn('Build Error!');
      return;
    }
  
    const info = stats.toJson();
  
    if (stats.hasErrors()) {
      info.errors.forEach(msg => {
        console.error(msg);
      });
      
      spinner.warn('Build Error!');
      return;
    }
  
    if (stats.hasWarnings()) {
      info.warnings.forEach(msg => {
        console.warn(msg);
      });
    }

    spinner.succeed('Build Success!');
    printFileSizes(stats, webpackProd);
  });
}

start();