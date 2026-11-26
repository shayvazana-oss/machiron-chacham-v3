/** @type {import('tailwindcss').Config} */
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`

export default {
  future: { hoverOnlyWhenSupported: true }, // no sticky hover styles after a tap on touch screens
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // Light, colourful page: one violet accent for actions, the mascots' colours for section tints. Values live in src/index.css.
      colors: {
        bg: token('bg'),
        surface: token('surface'),
        ink: token('ink'),
        muted: token('muted'),
        line: token('line'),
        accent: token('accent'),
        'accent-ink': token('accent-ink'),
        'accent-hi': token('accent-hi'),
        night: '#0C0F0B', // fixed dark used on top of media, same in both themes
      },
      fontFamily: {
        display: ['"Fredoka Variable"', '"Rubik Variable"', 'system-ui', 'sans-serif'],
        body: ['"Rubik Variable"', 'system-ui', 'sans-serif'],
        mono: ['"Geist Mono Variable"', 'ui-monospace', 'monospace'],
      },
      // Radius rule: media and panels 24px, small tiles 16px, inputs 12px, buttons full pill.
      borderRadius: { media: '24px', tile: '16px', field: '12px' },
      maxWidth: { page: '1240px' },
    },
  },
  plugins: [],
}
