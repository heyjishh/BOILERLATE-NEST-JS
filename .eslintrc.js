module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint/eslint-plugin', // TypeScript-specific linting rules
    // 'prettier', // Integrates Prettier into ESLint
    'import', // Linting for ES6+ import/export syntax
  ],
  extends: [
    'plugin:@typescript-eslint/recommended', // Recommended TypeScript rules
    // 'plugin:prettier/recommended', // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Always put it last.
    'plugin:import/errors', // Additional import linting rules
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js', 'dist/', 'node_modules/', '.env'],
  rules: {
    // TypeScript-specific rules
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',

    // Additional rules
    // 'prettier/prettier': ['error', { singleQuote: true, endOfLine: 'auto' }], // Ensures code is formatted according to Prettier config
    'no-var': 'error', // Disallows usage of var
    "prefer-const": [
      "error",
      {
        "destructuring": "any",
        "ignoreReadBeforeAssign": true
      }
    ],
    'import/order': [
      'error',
      {
        groups: [
          ['builtin', 'external'],
          'internal',
          ['parent', 'sibling', 'index'],
        ],
        'newlines-between': 'always',
      },
    ], // Ensures consistent import order
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/*.test.ts',
          '**/*.spec.ts',
          '**/test/**',
          '**/webpack.*.ts',
          '**/*.config.ts',
        ],
        optionalDependencies: false,
        peerDependencies: true,
      },
    ], // Prevents unnecessary dependencies
    'class-methods-use-this': 'off', // Allows class methods to not use `this`
    'lines-between-class-members': [
      'error',
      'always',
      { exceptAfterSingleLine: true },
    ], // Enforces spacing between class members
    'max-classes-per-file': 'off', // Allows multiple classes per file
    'no-useless-constructor': 'off', // Allows constructors that don't do anything
    'import/prefer-default-export': 'off', // Allows named exports without enforcing default export
    'no-unused-expressions': [
      'error',
      {
        allowShortCircuit: true,
        allowTernary: true,
        allowTaggedTemplates: true,
      },
    ],
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        args: 'none',
        caughtErrors: 'none',
        ignoreRestSiblings: true,
        vars: 'all',
      },
    ], // TypeScript-specific rule for unused variables
    'block-spacing': ['error', 'always'],
    'no-mixed-spaces-and-tabs': 'error',
    'comma-spacing': ['error', { before: false, after: true }],
    'comma-style': ['error', 'last'],
    'no-multiple-empty-lines': 'error',
    'no-param-reassign': 'off',
    'consistent-return': ['error'],
    'no-import-assign': 'error',
    'global-require': 'off',
    camelcase: 1,
    'no-return-await': 'off',
    'no-return-assign': 'off',
    'import/no-dynamic-require': 'off',
    'default-param-last': 'off',
    radix: 'off',
    'no-await-in-loop': 'off',
    'spaced-comment': ['error', 'always', { exceptions: ['-', '+'] }], // Enforces space after comment markers (e.g., `// Comment`)
    'no-underscore-dangle': 'off',
    'no-console': 'off',
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true, // Always try to resolve types under `<root>@types` directory even it doesn't contain any source code
        project: './tsconfig.json',
      },
    },
  },
};
