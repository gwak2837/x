import { includeIgnoreFile } from '@eslint/compat'
import pluginJs from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import nodePlugin from 'eslint-plugin-n'
import perfectionistNatural from 'eslint-plugin-perfectionist/configs/recommended-natural'
import pluginPromise from 'eslint-plugin-promise'
import globals from 'globals'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import tseslint from 'typescript-eslint'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const gitignorePath = path.resolve(__dirname, '.gitignore')

export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,
  nodePlugin.configs['flat/recommended-script'],
  pluginPromise.configs['flat/recommended'],
  perfectionistNatural,
  {
    files: ['backend/'],
    languageOptions: { globals: globals.node },
  },
  {
    ignores: [
      ...includeIgnoreFile(gitignorePath).ignores,
      'frontend/', // Next.js 14에서 ESLint v9 flat config 미지원
      'eslint.config.mjs',
    ],
  },
  {
    rules: {
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
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
