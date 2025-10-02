/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'ter-gold': '#F5C95D',
        'ter-olive': '#B8C77C',
        'ter-blue': '#A7CCD9',
        'ter-coral': '#E07A5F',
        'ter-taupe': '#8D725D',
        'ter-pink': '#F4B8C1',
        'ter-lavender': '#C5B9D6',
        'ter-dark': '#2A2927',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
