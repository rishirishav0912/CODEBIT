/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'border': 'border 4s linear infinite',
        'slide-border': 'slideBorder 4s linear infinite',
      },
      keyframes: {
        'border': {
          to: { '--border-angle': '360deg' },
        },

        slideBorder: {
          '0%': { 'background-position': '0% 0%' },
          '100%': { 'background-position': '200% 200%' },
        },


      }
    },
  },
  plugins: [],
};