import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

export default tseslint.config(
    // Global ignores (replaces ignorePatterns)
    {
        ignores: [
            'node_modules/',
            'dist/',
            'host/',
            'coverage/',
            '**/*.js',
            'webpack.*.ts',
        ],
    },

    // Base ESLint recommended rules
    ...tseslint.configs.recommended,

    // TypeScript + React files
    {
        files: ['**/*.{ts,tsx}'],
        plugins: {
            react: reactPlugin,
            'react-hooks': reactHooksPlugin,
        },
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.es2020,
                ...globals.jest,
            },
            parserOptions: {
                ecmaFeatures: { jsx: true },
            },
        },
        settings: {
            react: { version: 'detect' },
        },
        rules: {
            // Core ESLint rules
            'curly': 'error',
            'eqeqeq': ['error', 'always'],
            'no-bitwise': 'error',
            'no-console': 'error',
            'no-debugger': 'error',
            'no-eval': 'error',
            'no-duplicate-imports': 'error',
            'no-sparse-arrays': 'error',
            'no-var': 'error',
            'prefer-const': 'error',
            'prefer-object-spread': 'error',
            'radix': 'error',
            'use-isnan': 'error',
            'no-new-wrappers': 'error',
            'no-throw-literal': 'off',
            'no-empty': 'error',
            'no-fallthrough': 'error',
            'no-unsafe-finally': 'error',

            // TypeScript rules
            '@typescript-eslint/only-throw-error': 'off',
            '@typescript-eslint/adjacent-overload-signatures': 'error',
            '@typescript-eslint/no-restricted-types': 'error',
            '@typescript-eslint/no-empty-object-type': ['error', { allowInterfaces: 'always', allowObjectTypes: 'always' }],
            '@typescript-eslint/no-misused-new': 'error',
            '@typescript-eslint/no-namespace': 'error',
            '@typescript-eslint/no-require-imports': 'off',
            '@typescript-eslint/prefer-for-of': 'warn',
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-inferrable-types': 'off',
            '@typescript-eslint/explicit-member-accessibility': ['warn', {
                accessibility: 'explicit',
                overrides: { constructors: 'no-public' },
            }],

            // React rules
            'react/jsx-key': 'error',
            'react/jsx-no-bind': 'warn',
            'react/no-string-refs': 'error',
            'react/self-closing-comp': 'error',
            'react/prop-types': 'off',
            'react/display-name': 'off',
            'react/no-unescaped-entities': 'off',

            // React Hooks rules
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',

            // Shadow and return-await
            'no-shadow': 'off',
            '@typescript-eslint/no-shadow': 'warn',
            // return-await requires type-aware linting; disabled for now
            'no-return-await': 'off',
            '@typescript-eslint/return-await': 'off',
        },
    },
);
