/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy:    '#07090F',
        'navy-2':'#0D1220',
        'navy-3':'#131929',
        gold:    '#E8951A',
        'gold-dim':'#C47A10',
        'gold-glow':'#F5B042',
        'ink':   '#F0EDE8',
        'muted': '#8A8FA8',
      },
      fontFamily: {
        head: ['"Bricolage Grotesque"', 'sans-serif'],
        body: ['"Space Grotesk"', 'sans-serif'],
      },
      animation: {
        'float':      'float 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 4s ease-in-out infinite',
        'scan':       'scan 4s linear infinite',
        'ticker':     'ticker 28s linear infinite',
        'beam-sway':  'beamSway 18s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px) rotate(0deg)' },
          '40%':     { transform: 'translateY(-20px) rotate(1.5deg)' },
          '70%':     { transform: 'translateY(-8px) rotate(-1deg)' },
        },
        glowPulse: {
          '0%,100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%':     { opacity: '1',   transform: 'scale(1.2)' },
        },
        scan: {
          '0%':   { backgroundPosition: '0 -100%' },
          '100%': { backgroundPosition: '0 200%'  },
        },
        ticker: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        beamSway: {
          '0%,100%': { transform: 'rotate(0deg) scale(1)',    filter: 'blur(18px) opacity(.5)' },
          '25%':     { transform: 'rotate(-3deg) scale(1.1)', filter: 'blur(16px) opacity(.7)' },
          '50%':     { transform: 'rotate(3deg) scale(1.05)', filter: 'blur(20px) opacity(.4)' },
          '75%':     { transform: 'rotate(-1deg) scale(1.1)', filter: 'blur(17px) opacity(.6)' },
        },
      },
    },
  },
  plugins: [],
}
