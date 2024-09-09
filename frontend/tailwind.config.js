/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'bg-nav': 'linear-gradient(to right, #FF9933, #FFFFFF, #138808)',
      },
    },
  },
  plugins: [],
}
