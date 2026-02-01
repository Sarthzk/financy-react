/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: '#070b14',
        primary: '#0B50DA',
        gold: '#D4AF37',
        dark: '#0D141C',
        card: '#111928',
        border: '#242F3A'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}
