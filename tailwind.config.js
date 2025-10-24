/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#EF4F23',
        danger: '#EB001B',
        title: '#000000',
        'light-text': '#8D8D8D',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        jersey25: ['"Jersey 25"', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
