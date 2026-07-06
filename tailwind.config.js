/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Barlow Condensed"', 'sans-serif'],
        body: ['"Space Grotesk"', 'sans-serif'],
        data: ['Orbitron', 'monospace'],
      },
      colors: {
        void:    '#080d0a',
        surface: '#0f1a12',
        elevated:'#162119',
        lime:    '#39ff14',
        'lime-dim': '#2bc410',
        ember:   '#ff8c00',
        'ember-dim': '#cc7000',
        ice:     '#a8d8ea',
        hot:     '#ff3d57',
      },
      keyframes: {
        ticker: {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(-50%)' },
        },
        'border-draw': {
          from: { clipPath: 'inset(0 100% 100% 0)' },
          to:   { clipPath: 'inset(0 0% 0% 0)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.4' },
        },
      },
      animation: {
        ticker: 'ticker 40s linear infinite',
        'border-draw': 'border-draw 0.4s ease forwards',
        pulse: 'pulse 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
