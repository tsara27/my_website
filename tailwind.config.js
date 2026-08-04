module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    letterSpacing: {
      0: "-1px",
    },
    fontFamily: {
      regular: ['var(--font-nunito-sans)', "Roboto", "sans-serif"],
      display: ['var(--font-playfair-display)', "Times New Roman", "sans-serif"],
      article: ['var(--font-roboto-flex)'],
      logo: ["Signerica"],
    },
    extend: {
      colors: {
        alabaster: "#FAFAFA",
        black: "#121212",
        "candy-pink": "#E6757D",
        "dove-gray": "#6F6F6F",
        "faded-red": "#FF7B7A",
        gray: "#616161",
        "hint-of-red": "#F9F9F9",
        iron: "#CCCCCC",
        "light-dove-gray": "#727272",
        "light-gray": "#D2D2D2",
      },
    },
    screens: {
      'xs': "0px",
      'sm': "576px",
      'sm-tab': "640px",
      'md': "960px",
      'lg': "1440px",
    },
  },
  plugins: [],
};
