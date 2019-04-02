module.exports = {
  extends: ['mcansh/typescript'],
  settings: {
    'import/resolver': {
      'babel-plugin-root-import': {},
      typescript: {},
    },
  },
  overrides: {
    files: ['*.js', '.*.js'],
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
    },
  },
};
