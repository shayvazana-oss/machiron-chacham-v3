/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        screen: '#0C0C0B',  // projection-room black
        reel: '#161614',    // raised dark surface
        paper: '#F3F2EE',   // text pages
        ink: '#141413',     // text on paper
        ash: '#8B8A84',     // muted on both
        sand: '#CDB48C',    // Dead Sea salt-sand, used sparingly
      },
      fontFamily: {
        serif: ['"Frank Ruhl Libre"', '"Times New Roman"', 'serif'],
        sans: ['Heebo', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
