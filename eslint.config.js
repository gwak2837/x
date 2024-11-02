import { includeIgnoreFile } from '@eslint/compat'
import { FlatCompat } from '@eslint/eslintrc'
import pluginJs from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import nodePlugin from 'eslint-plugin-n'
import perfectionistNatural from 'eslint-plugin-perfectionist/configs/recommended-natural'
import pluginPromise from 'eslint-plugin-promise'
import globals from 'globals'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import tseslint from 'typescript-eslint'
// import pluginQuery from '@tanstack/eslint-plugin-query'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const gitignorePath = path.resolve(__dirname, '.gitignore')

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,
  nodePlugin.configs['flat/recommended-script'],
  pluginPromise.configs['flat/recommended'],
  perfectionistNatural,
  ...compat.extends('next/core-web-vitals'),
  ...compat.extends('next/typescript'),
  // ...pluginQuery.configs['flat/recommended'],
  {
    files: ['backend/'],
    languageOptions: { globals: globals.node },
  },
  {
    files: ['frontend/'],
    languageOptions: { globals: globals.browser },
  },
  {
    ignores: [...includeIgnoreFile(gitignorePath).ignores, 'eslint.config.js'],
  },
  {
    rules: {
      'no-async-promise-executor': 'off',
      'no-empty-pattern': 'warn',

      '@next/next/no-html-link-for-pages': ['error', 'frontend'],

      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',

      'import/no-anonymous-default-export': 'off',

      'n/no-missing-import': 'off',
      'n/no-unsupported-features/node-builtins': 'off',

      'perfectionist/sort-enums': 'off',
      'perfectionist/sort-objects': 'off',
      'perfectionist/sort-object-types': 'off',
      'perfectionist/sort-union-types': ['error', { 'nullable-last': true }],
    },
  },
  eslintConfigPrettier,
]
