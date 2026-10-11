/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        night: '#0A0C0D',   // page ground
        coal: '#121618',    // raised panels
        slate: '#1C2124',   // borders / dividers
        bone: '#EEE9E0',    // primary text
        haze: '#8E979C',    // muted text
        gold: '#F4B740',    // golden-hour accent (CTAs)
        hud: '#A6E6EC',     // viewfinder telemetry
        rec: '#FF453A',     // record dot only
      },
      fontFamily: {
        display: ['Karantina', 'Heebo', 'system-ui', 'sans-serif'],
        body: ['"IBM Plex Sans Hebrew"', 'Heebo', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
