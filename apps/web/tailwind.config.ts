import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      aspectRatio: {
        '319/180': '319 / 180',
        '465/244': '465 / 244',
        '7/5': '7 / 5',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif', ...defaultTheme.fontFamily.sans],
      },
      height: {
        'sidenav-desktop': 'calc(100vh - var(--header-height-desktop))',
        'sidenav-mobile': 'calc(100vh - var(--header-height-mobile))',
      },
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
        'dark-1000': '#d9d9d9',
        accent: '#8efb9d',
        dark: '#1C1C1C',
        primary: '#4452ff',
      },
      container: {
        center: true,
      },
      boxShadow: {
        1: '0px 1px 3px 0px rgba(166, 175, 195, 0.40)',
        2: '0px 5px 12px 0px rgba(0, 0, 0, 0.10)',
        3: '0px 4px 12px 0px rgba(13, 10, 44, 0.06)',
        4: '0px 10px 30px 0px rgba(85, 106, 235, 0.12), 0px 4px 10px 0px rgba(85, 106, 235, 0.04), 0px -18px 38px 0px rgba(85, 106, 235, 0.04)',
        5: '0px 13px 40px 0px rgba(13, 10, 44, 0.12), 0px -8px 18px 0px rgba(13, 10, 44, 0.04)',
        6: '0px 12px 34px 0px rgba(13, 10, 44, 0.08), 0px 34px 26px 0px rgba(13, 10, 44, 0.05)',
      },
      borderRadius: {
        3.75: '0.9375rem',
        2.5: '0.625rem',
        4.5: '1.125rem',
      },
      spacing: {
        'header-desktop': 'var(--header-height-desktop)',
        'header-mobile': 'var(--header-height-mobile)',
        '2.5': '0.625rem',
        15: '3.75rem',
        49: '12.25rem',
        50: '12.5rem',
      },
      zIndex: {
        999999: '999999',
        99999: '99999',
        9999: '9999',
        999: '999',
        99: '99',
        9: '9',
        1: '1',
      },
    },
  },
  plugins: [],
};
export default config;
