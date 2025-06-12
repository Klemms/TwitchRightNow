import path from 'node:path';
import {defineConfig} from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
    modules: ['@wxt-dev/module-react'],
    srcDir: 'src',
    outDir: 'dist',
    webExt: {
        chromiumProfile: `${path.resolve('.wxt/chrome-data')}`,
        keepProfileChanges: true,
    },
    imports: {
        eslintrc: {
            enabled: 9,
        },
    },
    vite: () => ({
        build: {
            minify: false,
            sourcemap: true,
        },
        server: {
            hmr: false,
        },
    }),
    manifest: {
        name: '__MSG_app_name__',
        description: '__MSG_app_description__',
        key: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAg+R+P1ucI5Dp21XEhEcpOz/SPRZf8SlpM4cBM7gGxNPzzIrpP+efChXxAIaeoWH/A7lNi19IZekbLSAC5iqlICq0HCwtUmLiuvzvCLFceECWIW5qC0Ri2auV0Gm9NKwxXr5U0TWRjYeWKRU7RnIll5TM/M+8nMJZIHJ6FbVZzlMLL9Jr85SK9k6DjAc9VxhE106oacn1mUf7Byg0OxmmO5/spY7mY2KYM4Dx9D9lJSnklDNocy2ylH2t2yI8uSNN8QPSQQZjTKn/M/rnq0BE5ExaTH13K+o/ZE8stDZCI+Cs/a72XIiMUr19lWs7sHr5GaupQPkuk2qM3/w0GEsezQIDAQAB',
        minimum_chrome_version: '120',
        default_locale: 'en',
        action: {
            default_title: 'Twitch Right Now',
        },
        icons: {
            256: '/icon.png',
        },
        permissions: ['storage', 'alarms', 'notifications'],
        externally_connectable: {
            matches: ['https://klemms.github.io/TwitchRightNow/*'],
        },
    },
});
