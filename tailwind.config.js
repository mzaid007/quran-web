/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          teal: '#1F8E84',
          tealDark: '#176F67',
          gold: '#C5A059',
          goldDark: '#9C8872',
          surfaceDark: '#0F1212',
          cardDark: '#1A1E1E',
          borderDark: '#2C3434'
        }
      },
      fontFamily: {
        hafs: ['"KFGQPC HAFS Uthmanic Script"', 'hafs', 'serif'],
        indopak: ['"Qalam Majeed 3 (AndiUnpam)"', 'qalammajeed3', 'serif'],
        bismillah: ['bismillah', 'serif'],
        transliteration: ['Transliteration', 'sans-serif']
      }
    },
  },
  plugins: [],
}
