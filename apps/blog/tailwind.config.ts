import sharedConfig from '@repo/tailwind-config';
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
    '../../packages/layout/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      height: {
        'sidenav-desktop': 'calc(100vh - var(--header-height-desktop))',
        'sidenav-mobile': 'calc(100vh - var(--header-height-mobile))',
      },
    },
  },
  plugins: [sharedConfig],
};
export default config;
