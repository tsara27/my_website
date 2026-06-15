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
      sans: ["Nunito Sans", "Roboto", "sans-serif"],
      display: ["Playfair Display", "Times New Roman", "sans-serif"],
      article: ["Roboto Flex"],
      logo: ["Signerica"],
    },
    extend: {
      colors: {
        alabaster: "#FAFAFA",
        black: "#121212",
        "candy-pink": "#E6757D",
        "dove-gray": "#6F6F6F",
        "faded-red": "#FF7B7A",
        gray: "#505050",
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
