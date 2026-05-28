import js from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import autoImports from './.wxt/eslint-auto-imports.mjs';

export default tseslint.config(
    autoImports,
    {ignores: ['dist', 'node_modules']},
    {
        extends: [
            js.configs.recommended,
            tseslint.configs.recommended,
            reactHooks.configs.flat.recommended,
            reactRefresh.configs.vite,
            eslintPluginPrettierRecommended,
        ],
        files: ['**/*.{ts,tsx,js,jsx}'],
        languageOptions: {
            ecmaVersion: 2023,
            globals: {
                ...globals.browser,
            },
        },
        rules: {
            //'react-refresh/only-export-components': ['warn', {allowConstantExport: true}],
            'no-unused-vars': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
        },
    }
);
