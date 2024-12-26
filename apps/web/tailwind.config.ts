import sharedConfig from '@repo/tailwind-config';
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    'node_modules/@repo/ui/dist/**/*.js',
  ],
  theme: {
    extend: {
      height: {
        'sidenav-desktop': 'calc(100vh - var(--header-height-desktop))',
        'sidenav-mobile': 'calc(100vh - var(--header-height-mobile))',
      },
      spacing: {
        'header-desktop': 'var(--header-height-desktop)',
        'header-mobile': 'var(--header-height-mobile)',
      },
    },
  },
  plugins: [sharedConfig],
};
export default config;
