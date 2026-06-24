/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          neon: {
            blue: '#00d4ff',
            gold: '#ffd700',
            purple: '#b537f2',
            pink: '#ff2d95',
            green: '#00ff88'
          }
        },
        animation: {
          'float': 'float 6s ease-in-out infinite',
          'glow-pulse': 'glowPulse 2s ease-in-out infinite alternate',
          'slide-up': 'slideUp 0.5s ease-out',
          'fade-in': 'fadeIn 0.5s ease-out',
          'grid-move': 'gridMove 20s linear infinite',
        },
        keyframes: {
          float: {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-20px)' },
          },
          glowPulse: {
            '0%': { boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)' },
            '100%': { boxShadow: '0 0 40px rgba(0, 212, 255, 0.8)' },
          },
          slideUp: {
            '0%': { transform: 'translateY(20px)', opacity: '0' },
            '100%': { transform: 'translateY(0)', opacity: '1' },
          },
          fadeIn: {
            '0%': { opacity: '0' },
            '100%': { opacity: '1' },
          },
          gridMove: {
            '0%': { backgroundPosition: '0 0' },
            '100%': { backgroundPosition: '0 60px' },
          }
        },
      },
    },
    plugins: [],
  }