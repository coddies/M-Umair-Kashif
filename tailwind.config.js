/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./resume.html",
    "./js/**/*.js"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#facc15",
        background: "#050505",
        surface: "#1a1a1a",
        "surface-bright": "#252525",
        "on-surface": "#ebe2d0",
        "on-surface-variant": "#d1c6ab",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
