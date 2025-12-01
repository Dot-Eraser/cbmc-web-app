/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        saffron: {
          DEFAULT: '#FF9933',
          light: '#FFB366',
        },
        maroon: {
          DEFAULT: '#800020',
          deep: '#5C0015',
        },
        gold: {
          DEFAULT: '#D4AF37',
          light: '#F4E4BA',
        },
        cream: {
          DEFAULT: '#FFF8F0',
          dark: '#F5EBE0',
        },
      },
      fontFamily: {
        playfair: ['Playfair Display', 'serif'],
        sans: ['Source Sans 3', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
