/** @type {import('tailwindcss').Config} */
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`

export default {
  future: { hoverOnlyWhenSupported: true }, // no sticky hover styles after a tap on touch screens
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // One neutral family (green-tinted) + one accent. Values live in src/index.css and swap for dark mode.
      colors: {
        bg: token('bg'),
        surface: token('surface'),
        ink: token('ink'),
        muted: token('muted'),
        line: token('line'),
        accent: token('accent'),
        'accent-ink': token('accent-ink'),
        night: '#0C0F0B', // fixed dark used on top of media, same in both themes
      },
      fontFamily: {
        display: ['"Heebo Variable"', 'system-ui', 'sans-serif'],
        body: ['"Assistant Variable"', 'system-ui', 'sans-serif'],
      },
      // Radius rule: media and panels 24px, small tiles 16px, inputs 12px, buttons full pill.
      borderRadius: { media: '24px', tile: '16px', field: '12px' },
      maxWidth: { page: '1240px' },
    },
  },
  plugins: [],
}
