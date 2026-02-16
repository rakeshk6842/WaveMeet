/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'whatsapp-green': '#25D366',
        'whatsapp-dark': '#111B21',
        'whatsapp-lighter': '#202C33',
      }
    },
  },
  plugins: [],
}
