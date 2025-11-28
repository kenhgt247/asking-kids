/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Comic Sans MS"', '"Chalkboard SE"', 'sans-serif'],
      },
      colors: {
        'kid-blue': '#4CC9F0',
        'kid-pink': '#F72585',
        'kid-yellow': '#FFD60A',
        'kid-green': '#06D6A0',
        'kid-purple': '#7209B7',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}