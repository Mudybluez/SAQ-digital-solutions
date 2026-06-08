/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy:    'rgb(var(--navy-rgb) / <alpha-value>)',
        'navy-2':'rgb(var(--navy-2-rgb) / <alpha-value>)',
        'navy-3':'rgb(var(--navy-3-rgb) / <alpha-value>)',
        gold:    'rgb(var(--gold-rgb) / <alpha-value>)',
        'gold-dim':'rgb(var(--gold-dim-rgb) / <alpha-value>)',
        'gold-glow':'rgb(var(--gold-glow-rgb) / <alpha-value>)',
        'ink':   'rgb(var(--ink-rgb) / <alpha-value>)',
        'muted': 'rgb(var(--muted-rgb) / <alpha-value>)',
        white:   'rgb(var(--white-rgb) / <alpha-value>)',
      },
      fontFamily: {
        head: ['"Bricolage Grotesque"', 'sans-serif'],
        body: ['"Space Grotesk"', 'sans-serif'],
      },
      animation: {
        'float':      'float 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 4s ease-in-out infinite',
        'scan-line':  'scanLine 4s linear infinite',
        'ticker':     'ticker 28s linear infinite',
        'beam-sway':  'beamSway 18s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translate3d(0, 0px, 0) rotate(0deg)' },
          '40%':     { transform: 'translate3d(0, -20px, 0) rotate(1.5deg)' },
          '70%':     { transform: 'translate3d(0, -8px, 0) rotate(-1deg)' },
        },
        glowPulse: {
          '0%,100%': { opacity: '0.6', transform: 'scale(1) translate3d(0,0,0)' },
          '50%':     { opacity: '1',   transform: 'scale(1.2) translate3d(0,0,0)' },
        },
        scanLine: {
          '0%':   { transform: 'translate3d(0, -120px, 0)' },
          '100%': { transform: 'translate3d(0, 100vh, 0)' },
        },
        ticker: {
          '0%':   { transform: 'translate3d(0, 0, 0)' },
          '100%': { transform: 'translate3d(-50%, 0, 0)' },
        },
        beamSway: {
          '0%,100%': { transform: 'rotate(0deg) scale(1)',    opacity: '0.45' },
          '25%':     { transform: 'rotate(-3deg) scale(1.1)', opacity: '0.63' },
          '50%':     { transform: 'rotate(3deg) scale(1.05)', opacity: '0.36' },
          '75%':     { transform: 'rotate(-1deg) scale(1.1)', opacity: '0.54' },
        },
      },
    },
  },
  plugins: [],
}
