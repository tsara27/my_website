  tailwind.config = {
    darkMode: 'class',
    theme: {
      extend: {
        colors: {
          brand: {
            black: '#070709',
            surface: '#0f0f14',
            card: '#15151c',
            border: '#2a1728',
            magenta: '#ff007f',
            magentaGlow: '#ff1493',
            magentaLight: '#ff4da6',
            magentaDark: '#99004d',
          }
        },
        fontFamily: {
          heading: ['"Chakra Petch"', 'sans-serif'],
          sans: ['"Inter"', 'sans-serif'],
        },
        boxShadow: {
          'neon': '0 0 20px -3px rgba(255, 0, 127, 0.45)',
          'neon-lg': '0 0 35px -2px rgba(255, 0, 127, 0.55)',
          'inner-glow': 'inset 0 0 15px rgba(255, 0, 127, 0.15)',
        }
      }
    }
  }
