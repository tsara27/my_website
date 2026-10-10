tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        black: '#070709',
        surface: {
          DEFAULT: '#0d0d12',
          card: '#13121a',
          cardHover: '#181722',
          border: '#2a1a36'
        },
        magenta: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f472b6',
          400: '#f042a3',
          500: '#e11488',
          600: '#c20770',
          accent: '#f43f8e',
          neon: '#ff1493',
          glow: 'rgba(255, 20, 147, 0.35)'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      boxShadow: {
        'neon': '0 0 25px -4px rgba(225, 20, 136, 0.45)',
        'neon-lg': '0 0 45px -5px rgba(255, 20, 147, 0.55)',
        'neon-inner': 'inset 0 0 20px rgba(225, 20, 136, 0.2)'
      }
    }
  }
};
