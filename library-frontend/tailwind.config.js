module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
      'rapunzel-bg': '#f0def7',         // pastel lavender-pink (matches UI background)
      'rapunzel-purple': '#a259c9',
      'rapunzel-green': '#75D67B',      // slightly deeper mint green for improved visibility
      'rapunzel-yellow': '#FFD600', 
      'rapunzel-card-yellow': '#fff066ff', // vibrant yellow for visibility
      'rapunzel-lavender': '#d6b5fa',
      'rapunzel-pink': '#f0def7',
      'rapunzel-usercard': '#6C399B', // rich deep purple for usercard, strongly visible and bold
      'rapunzel-button': '#A259C9',   // vibrant purple for buttons
      'rapunzel-button-hover': '#8e45b3', // slightly darker purple for button hover state
      'rapunzel-border': '#e0b3ff',    // light lavender for borders
      'rapunzel-text': '#4B0082',      // deep indigo for text for strong contrast  
    },
      fontFamily: {
      'rapunzel': ['Nunito', 'Arial', 'sans-serif'], // matches the image's text style
    }
    },
  },
  plugins: [],
}
