const eslint = require('@eslint/js');
const tseslint = require('@typescript-eslint/eslint-plugin');
const tseslintParser = require('@typescript-eslint/parser');
const globals = require('globals');
const importPlugin = require('eslint-plugin-import');

module.exports = [
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslintParser,
      parserOptions: {
        project: ['./tsconfig.json', './tsconfig.dev.json'],
        sourceType: 'module',
      },
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'import': importPlugin,
    },
    rules: {
      ...eslint.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      'quotes': 'off',
      'import/no-unresolved': 'off',
      'indent': ['error', 2],
      'max-len': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'no-inner-declarations': 'off',
    },
    ignores: [
      'lib/**/*',
      'node_modules/**/*',
      '!node_modules/@typescript-eslint/**/*',
    ],
  },
]; 