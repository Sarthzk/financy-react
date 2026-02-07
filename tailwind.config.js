/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light mode colors
        light: {
          bg: '#FFFFFF',
          bg_secondary: '#F5F7FA',
          text: '#1F2937',
          text_secondary: '#6B7280',
          border: '#E5E7EB',
          card: '#FFFFFF',
        },
        // Dark mode colors
        dark_mode: {
          bg: '#070b14',
          bg_secondary: '#111928',
          text: '#F3F4F6',
          text_secondary: '#D1D5DB',
          border: '#242F3A',
          card: '#1F2937',
        },
        // Brand colors
        midnight: '#070b14',
        primary: '#0B50DA',
        gold: '#D4AF37',
        dark: '#0D141C',
        card: '#111928',
        border: '#242F3A'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        'sm-light': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'md-light': '0 4px 6px rgba(0, 0, 0, 0.07)',
        'lg-light': '0 10px 15px rgba(0, 0, 0, 0.1)',
        'sm-dark': '0 1px 2px rgba(0, 0, 0, 0.5)',
        'md-dark': '0 4px 6px rgba(0, 0, 0, 0.5)',
        'lg-dark': '0 10px 15px rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
}

