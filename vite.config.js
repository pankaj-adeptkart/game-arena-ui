import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
            manifest: {
                name: 'Neon Catch-Up',
                short_name: 'NeonGame',
                description: 'A futuristic 3D strategy game',
                theme_color: '#000000',
                background_color: '#000000',
                display: 'standalone',
                orientation: 'portrait',
                icons: [
                    { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
                    { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
                ],
            },
        }),
    ],

    // ✅ ADD THIS BLOCK
    test: {
        environment: 'jsdom',
        globals: true,                  // <-- FIXES describe/test/expect
        setupFiles: './src/tests/setup.js',
        coverage: {
            provider: 'v8',
            lines: 80,
            functions: 80,
            branches: 70,
        },
    },
})
