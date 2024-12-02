/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        wiggle: {
          '0%, 50%, 100%': { transform: 'rotate(-1deg)' },
          '25%, 75%': { transform: 'rotate(1deg)' },
        }
      },
      animation: {
        wiggle: 'wiggle 0.5s ease-in-out infinite',
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      "business",
      "nord"
    ]
  },
  darkMode: ['selector', '[data-theme="business"]']
}

