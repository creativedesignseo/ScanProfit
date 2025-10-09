/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        baraki: {
          yellow: '#FFD700',
          'yellow-light': '#FFE44D',
          'yellow-dark': '#E6C200',
          black: '#1A1A1A',
          'black-light': '#2D2D2D',
        },
      },
    },
  },
  plugins: [],
};
