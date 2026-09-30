/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#070F1E',
          900: '#0B192C',
          800: '#142942',
          700: '#1E3E62',
          600: '#2A5584',
        },
        brand: {
          blue: '#0066CC',
          light: '#0D8BFF',
          accent: '#2563EB',
          subtle: '#E8F2FC',
          dark: '#003366',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
