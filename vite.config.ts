import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';

const ReactCompilerConfig = {};

console.error(import.meta.env.MODE);

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react({
            babel: {
                plugins: [['babel-plugin-react-compiler', ReactCompilerConfig]],
            },
        }),
    ],
    build: {
        minify: false,
        sourcemap: true,
    },
});
