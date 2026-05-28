/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
      },
      colors: {
        gold: {
          400: '#c4913a',
          500: '#a87830',
        },
        surface: {
          0: '#0c0c0e',
          1: '#131316',
          2: '#1a1a1e',
          3: '#212126',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease forwards',
        'pulse-slow': 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
