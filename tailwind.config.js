module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        rapunzel: {
          lavender: "#b57edc",
          lightlavender: "#f3e6fa",
          yellow: "#ffe066",
          green: "#9EDC9E",
          purple: "#a259c3",
          accent: "#ffd6ec",
          apricot: "#ffe5c7" // for special card
        }
      },
      fontFamily: {
        rapunzel: ["Inter", "Segoe UI", "system-ui", "sans-serif"]
      }
    },
  },
  plugins: [],
}
