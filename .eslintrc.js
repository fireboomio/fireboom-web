module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'next/core-web-vitals',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:react/jsx-runtime',
    'plugin:import/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
    ecmaFeatures: {
      impliedStrict: true,
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks', '@typescript-eslint', 'import'],
  ignorePatterns: ['.eslintrc.js', '.next/', 'out/'],
  rules: {
    '@typescript-eslint/ban-ts-comment': [
      'error',
      {
        'ts-expect-error': 'allow-with-description',
        'ts-ignore': false,
        'ts-nocheck': true,
        'ts-check': false,
        minimumDescriptionLength: 5,
      },
    ],
    '@typescript-eslint/no-unused-vars': [
      'error',
      { varsIgnorePattern: '^_', argsIgnorePattern: '^_' },
    ],
    'import/no-duplicates': 'error',
    'import/no-unused-modules': 'error',
    'import/no-unassigned-import': ['error', { allow: ['**/*.css'] }],
    'import/order': [
      'error',
      {
        alphabetize: { order: 'asc', caseInsensitive: false },
        'newlines-between': 'always',
        groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
        pathGroups: [],
        pathGroupsExcludedImportTypes: [],
      },
    ],
    'no-console': 'warn',
    'array-bracket-newline': ['error', 'consistent'],
    // 'array-bracket-spacing': [
    //   'error',
    //   'always',
    //   { singleValue: false, objectsInArrays: false, arraysInArrays: false },
    // ],
    'object-curly-newline': ['error', { consistent: true }],
    'object-curly-spacing': [
      'error',
      'always',
      { arraysInObjects: false, objectsInObjects: false },
    ],
    'comma-dangle': ['error', 'only-multiline'],
    quotes: ['error', 'single'],
    'jsx-quotes': ['error', 'prefer-double'],
  },
}