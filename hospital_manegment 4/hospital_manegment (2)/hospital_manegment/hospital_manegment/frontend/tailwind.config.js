/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        health: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#0f766e', // Teal primary
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0284c7', // Sky cyan
          600: '#0284c7',
          700: '#0369a1',
        }
      }
    },
  },
  plugins: [],
}
