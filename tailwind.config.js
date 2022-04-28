module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    letterSpacing: {
      '0': '-1px',
    },
    fontFamily: {
      sans: ["Nunito Sans", "Roboto", "sans-serif"],
      display: ["Playfair Display", "Times New Roman", "sans-serif"],
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
  },
  plugins: [],
};
