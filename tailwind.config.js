/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"Segoe UI"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        serif: ['"Noto Serif SC"', 'Georgia', 'Cambria', 'serif'],
        cjk: ['"Noto Serif SC"', '"Source Han Serif SC"', 'serif'],
      },
      colors: {
        jade: {
          400: 'oklch(62% 0.12 162)',
          500: 'oklch(50% 0.10 162)',
        },
        gold: { 400: '#c4913a', 500: '#a87830' },
        surface: { 0: '#070709', 1: '#0f0f12', 2: '#171719', 3: '#1f1f22' },
      },
      animation: {
        'fade-in':    'fadeIn 0.4s ease both',
        'fade-in-up': 'fadeInUp 0.55s cubic-bezier(0.16, 1, 0.3, 1) both',
        'glow-pulse': 'glowPulse 2.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:    { from: { opacity: '0' }, to: { opacity: '1' } },
        fadeInUp:  { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'none' } },
        glowPulse: { '0%,100%': { opacity: '0.6' }, '50%': { opacity: '1' } },
      },
    },
  },
  plugins: [],
};
