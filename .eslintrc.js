/**
 * https://eslint.org/docs/latest/developer-guide/shareable-configs
 */
module.exports = {
  parserOptions: {},
  env: {
    es6: true,
    node: true,
    browser: true,
    mocha: true,
    jasmine: true,
    jest: true
  },
  plugins: ['simple-import-sort', 'jsx-a11y', 'promise', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended'
  ],
  rules: {
    'no-unused-vars': 'warn',
    // TypeScript's `noFallthroughCasesInSwitch` option is more robust (#6906)
    'default-case': 'off',
    // 'tsc' already handles this (https://github.com/typescript-eslint/typescript-eslint/issues/291)
    'no-dupe-class-members': 'off',
    // 'tsc' already handles this (https://github.com/typescript-eslint/typescript-eslint/issues/477)
    'no-undef': 'off',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',

    // https://github.com/benmosher/eslint-plugin-import/tree/master/docs/rules
    'import/export': 'error',
    'import/first': 'error',
    'import/no-absolute-path': ['error', { esmodule: true, commonjs: true, amd: false }],
    'import/no-duplicates': 'error',
    'import/no-named-default': 'error',
    'import/no-webpack-loader-syntax': 'error',

    // https://www.npmjs.com/package/eslint-plugin-promise
    'promise/param-names': 'error',

    // react
    'react/prop-types': 'off',
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'jsx-a11y/media-has-caption': 'off',
    'jsx-a11y/anchor-is-valid': 'warn',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/no-autofocus': 'off',
    'jsx-a11y/no-noninteractive-element-interactions': 'off'
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  overrides: [
    {
      files: ['**/*.ts?(x)'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2020,
        tsconfigRootDir: process.cwd(),
        project: ['./tsconfig.json']
      },
      plugins: ['@typescript-eslint'],
      rules: {
        // export type 和 @typescript-eslint/consistent-type-imports 一起使用避免 nest 中 class 被导入为type
        '@typescript-eslint/consistent-type-exports': 'error',
        // 右侧定义类型
        '@typescript-eslint/consistent-generic-constructors': 'warn',
        // 使用 Record<> 而不是[key: string]
        '@typescript-eslint/consistent-indexed-object-style': 'warn',
        // 不要使用 as
        '@typescript-eslint/consistent-type-assertions': 'warn',
        // 尽量使用 import type
        '@typescript-eslint/consistent-type-imports': 'warn',
        // Add TypeScript specific rules (and turn off ESLint equivalents)
        'no-array-constructor': 'off',
        '@typescript-eslint/no-array-constructor': 'warn',
        'no-redeclare': 'off',
        '@typescript-eslint/no-redeclare': 'warn',
        'no-use-before-define': 'off',
        '@typescript-eslint/no-use-before-define': [
          'warn',
          {
            functions: false,
            classes: false,
            variables: false,
            typedefs: false
          }
        ],
        'no-unused-expressions': 'off',
        '@typescript-eslint/no-unused-expressions': [
          'error',
          {
            allowShortCircuit: true,
            allowTernary: true,
            allowTaggedTemplates: true
          }
        ],
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': [
          'warn',
          {
            args: 'none',
            ignoreRestSiblings: true
          }
        ],
        'no-useless-constructor': 'off',
        '@typescript-eslint/no-useless-constructor': 'warn'
      }
    }
  ],
  ignorePatterns: ['dist', 'node_modules', '**/public/**/*.js']
}
