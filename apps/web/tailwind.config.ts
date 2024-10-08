import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'blue-dark': '#323dcd',
        'blue-light': '#a1a8ff',
        'dark-200': '#282828',
        'dark-300': '#323232',
        'dark-400': '#3e3e3e',
        'dark-500': '#494949',
        'dark-600': '#555555',
        'dark-700': '#8d8d8d',
        'dark-800': '#a4a4a4',
        'dark-900': '#bababa',
        accent: '#8efb9d',
        dark: '#1C1C1C',
        primary: '#4452ff',
      },
    },
  },
  plugins: [],
};
export default config;
