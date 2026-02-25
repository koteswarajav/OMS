/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './screens/**/*.{ts,tsx}',
    './variants/**/*.{ts,tsx}',
    './flows/**/*.{ts,tsx}',
    './prototypes/**/*.{ts,tsx}',
    './design-system/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          DEFAULT: '#2B4FFF',
          hover:   '#1A3FE0',
          tint:    '#EEF1FF',
        },
      },
    },
  },
  plugins: [],
}
