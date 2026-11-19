/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#C8FF4D',
        'primary-dark': '#A6DD2A',
        'primary-light': '#DDFF8F',
        accent: '#8B7CFF',
        'accent-dark': '#6F5EF0',
        background: '#07080B',
        surface: '#0F1218',
        'surface-2': '#151922',
        ink: '#F4F5F0',
        muted: '#8E938B',
        divider: '#1E232C',
        deep: '#040507',
      },
      fontFamily: {
        display: ['Heebo', 'system-ui', 'sans-serif'],
        serif: ['"Frank Ruhl Libre"', 'serif'],
        body: ['Heebo', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: { '4xl': '2rem', '5xl': '2.5rem' },
      animation: {
        float: 'float 6s ease-in-out infinite',
        blink: 'blink 1s step-end infinite',
        kenburns: 'kenburns 24s ease-in-out infinite alternate',
        'kenburns-soft': 'kenburns-soft 26s ease-in-out infinite alternate',
        marquee: 'marquee 40s linear infinite',
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        blink: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0' } },
        kenburns: { '0%': { transform: 'scale(1.04)' }, '100%': { transform: 'scale(1.14) translate(-1.5%, -1%)' } },
        'kenburns-soft': { '0%': { transform: 'scale(1)' }, '100%': { transform: 'scale(1.06)' } },
        marquee: { to: { transform: 'translateX(-50%)' } },
      },
    },
  },
  plugins: [],
}
