import js from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import autoImports from './.wxt/eslint-auto-imports.mjs';

export default tseslint.config(
    autoImports,
    {ignores: ['dist']},
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended, eslintPluginPrettierRecommended],
        files: ['**/*.{ts,tsx,js,jsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: {
                ...globals.browser,
            },
        },
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            'react-hooks/react-compiler': 'error',
            'react-refresh/only-export-components': ['warn', {allowConstantExport: true}],
            'no-unused-vars': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
        },
    }
);
