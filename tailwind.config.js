/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#F6F3ED',
                primary: '#2B2622',
                textDark: '#1C1917',
                accent: '#B06B1A',
                surface: '#EAE5DB',
                border: '#D8D0C3'
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                serif: ['Cormorant Garamond', 'serif'],
            },
            transitionTimingFunction: {
                'magnetic': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }
        },
    },
    plugins: [],
}
