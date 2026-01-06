/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#10b981',
          secondary: '#14b8a6',
          accent: '#10b981',
        }
      }
    },
  },
  plugins: [],
}
