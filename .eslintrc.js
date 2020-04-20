module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: '6',
  },
  env: {
    browser: true,
  },
  extends: 'standard',
  plugins: [
    'html'
  ],
  rules: {
    'comma-dangle': ['error', 'always-multiline'],
    'no-new': 'off',
    'semi': ['error', 'always'],
    'node/no-unpublished-require': 'off'
  }
}
