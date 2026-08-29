import sharedConfig from '@repo/tailwind-config';
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
    '../../packages/layout/src/**/*.{ts,tsx}',
  ],
  plugins: [sharedConfig],
};
export default config;
