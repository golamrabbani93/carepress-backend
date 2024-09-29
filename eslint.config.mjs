import eslint from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    rules: {
      'no-unused-vars': [
        'error',
        { vars: 'all', args: 'after-used', ignoreRestSiblings: false },
      ],
      'no-undef': 'error',
      'prefer-const': 'error',
      'no-console': 'warn',
    },
    settings: {
      fixable: {
        'no-unused-vars': 'allow', // Allow fixing when `lint:fix` is run
        'prefer-const': 'error',
        'no-unused-expressions': 'error',
      },
    },
  },
  {
    ignores: ['**/node_modules/', '**/dist/'],
  },
)
