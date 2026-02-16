/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'wavemeet-green': '#25D366',
        'wavemeet-dark': '#111B21',
        'wavemeet-lighter': '#202C33',
      }
    },
  },
  plugins: [],
}
