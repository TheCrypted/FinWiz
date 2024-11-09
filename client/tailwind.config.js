/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif_bold: ["DM Serif Display", "serif"],
        serif_light: ["Noto Serif Display", "serif"]
      }
    },
  },
  plugins: [],
}

