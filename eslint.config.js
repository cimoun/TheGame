import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: ['node_modules/**', 'dist/**', '.vite/**', 'game.js', 'src/**/*.js'],
  },
  {
    files: ['**/*.{js,mjs,ts}'],
    ...js.configs.recommended,
  },
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,mjs}'],
    ...tseslint.configs.disableTypeChecked,
  },
  {
    files: ['**/*.spec.ts', '**/*.test.ts', '**/test-setup.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    files: ['**/*.ts'],
    ignores: ['**/*.spec.ts', '**/*.test.ts', '**/test-setup.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  {
    ...prettier,
  }
);
