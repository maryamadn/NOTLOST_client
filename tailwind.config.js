/** @type {import('tailwindcss').Config} */
// const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./node_modules/flowbite/**/*.js"],
  theme: {
    screens: {
      'sm': '400px',
      // => @media (min-width: 400px) { ... }

      'md': '650px',
      // => @media (min-width: 650px) { ... }

      // 'lg': '1024px',
      // // => @media (min-width: 1440px) { ... }
    },
    extend: {
      container: {
        center: true,
      },
    },
  },
  plugins: [require("daisyui"), require('flowbite/plugin')],
}
