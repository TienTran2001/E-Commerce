/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    fontFamily: {
      main: ['Poppins', 'sans-serif'],
    },
    extend: {
      width: {
        main: '1120px',
      },
      colors: {
        main: '#ee3131',
        text: '#505050',
      },
    },
  },
  plugins: [],
};
