/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        aw: {
          blue: '#0F3A7A',
          'blue-dark': '#0B2E62',
          'blue-deep': '#0A2955',
          yellow: '#FFE81A',
          'yellow-dark': '#F5D800',
          'soft-blue': '#EFF4FB',
          'soft-peach': '#FBF2EC',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
