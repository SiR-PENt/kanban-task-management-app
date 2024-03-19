/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
     "./node_modules/flowbite-react/lib/**/*.js",
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
       'main-purple': '#635fc7',
       'dark-grey': '#2b2c37',
       'medium-grey': '#828FA3',
       'very-dark-grey': '#20212C',
       'light-grey': '#F4F7FD',
       'red': '#EA5555',
       'lines-dark': '#3E3F4E',
       'primary': '#a8a4ff',
       'light-red':'#ff9898',
       'light-idle': '#f4f7fd',
       'light-hovered': "#e4ebfa",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
      require('flowbite/plugin'),
  ],
}
