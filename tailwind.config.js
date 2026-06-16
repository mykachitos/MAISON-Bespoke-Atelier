/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0e0e14",
        surface: "#15151f",
        card: "#1e1e2e",
        gold: "#c9a84c",
        muted: "#9a9480",
        soft: "#f0ede6",
      },
      fontFamily: {
        serif: ["Cormorant Garamond", "serif"],
        sans: ["Jost", "sans-serif"],
      },
      boxShadow: {
        gold: "0 30px 100px rgba(201,168,76,0.16)",
      },
    },
  },
  plugins: [],
};