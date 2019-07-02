const cssnano = require('cssnano')
const autoprefixer = require('autoprefixer')
const postcssImport = require('postcss-import')

module.exports = {
  plugins: [
    autoprefixer(),
    postcssImport(),
    cssnano({
      safe: true,
      core: false,
    }),
  ],
}