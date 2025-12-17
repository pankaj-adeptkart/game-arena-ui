/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');

export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            // OPTIONAL: Smooth easing for all transitions
            transitionTimingFunction: {
                DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
            }
        },
    },
    plugins: [
        plugin(function ({ addBase, addComponents, addUtilities }) {
            // 1. GLOBAL RESETS (Injects into body/html automatically)
            addBase({
                'html': {
                    'scroll-behavior': 'smooth',
                    'overscroll-behavior-y': 'none', // Prevents rubber-banding on mobile
                    '-webkit-tap-highlight-color': 'transparent', // Removes mobile tap lag
                },
                'body': {
                    '-webkit-font-smoothing': 'antialiased',
                    '-moz-osx-font-smoothing': 'grayscale',
                },
                // OPTIMIZE IMAGES GLOBALLY
                'img': {
                    'content-visibility': 'auto', // Skips rendering off-screen images
                }
            });

            // 2. AUTOMATIC MOBILE OPTIMIZATIONS
            // This forces any element with "backdrop-filter" to turn it off on weak devices/emulators
            addBase({
                '@media (max-width: 768px)': {
                    '[class*="backdrop-blur"]': {
                        'backdrop-filter': 'none !important',
                        'background-color': 'rgba(255, 255, 255, 0.95) !important', // Fallback to opaque
                        'box-shadow': '0 4px 6px -1px rgba(0, 0, 0, 0.1) !important',
                    }
                }
            });

            // 3. HARDWARE ACCELERATION UTILITY
            // Add this class manually ONLY to the specific elements causing lag
            addUtilities({
                '.gpu': {
                    'transform': 'translate3d(0, 0, 0)',
                    'backface-visibility': 'hidden',
                    'perspective': '1000px',
                    'will-change': 'transform, opacity',
                }
            });
        })
    ],
};