const webpack = require('webpack')
const path = require('path')
const fs = require('fs')
const gzipSize = require('gzip-size').sync
const filesize = require('filesize')
const chalk = require('chalk')
const ora = require('ora')
const webpackProd = require('../config/webpack.prod.js')

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

module.exports = () => {
  const spinner = ora(`building for production...`)
  spinner.start()
  webpack(webpackProd, (err, stats) => {
    if (err) {
      console.error(err.stack || err);
      if (err.details) {
        console.error(err.details);
      }
      return;
    }
  
    const info = stats.toJson();
  
    if (stats.hasErrors()) {
      console.error(info.errors);
      return
    }
  
    if (stats.hasWarnings()) {
      console.warn(info.warnings);
      return
    }

    spinner.succeed('Build Success!')
    printFileSizes(stats, webpackProd)
  });
}