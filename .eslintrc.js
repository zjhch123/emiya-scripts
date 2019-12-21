module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: "6",
  },
  env: {
    browser: true,
  },
  extends: 'standard',
  plugins: [
    'html'
  ],
  rules: {
    'no-unused-vars': 0,
    'comma-dangle': ['error', 'always-multiline'],
    'no-new': 'off',
  }
}
