import sharedConfig from '@repo/tailwind-config';
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // OG card palette — design reference only.
        // next/og (Satori) uses its own Tailwind interpreter and does not
        // read this config, so these tokens cannot be used via the tw prop
        // in apps/site/src/app/og/route.tsx.
        og: {
          accent: '#5CD66E',
          dark: '#070B12',
          'canvas-mid': '#0E1622',
          'canvas-end': '#10251C',
        },
      },
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
