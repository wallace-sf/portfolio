import sharedConfig from '@repo/tailwind-config';
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    'node_modules/@repo/ui/dist/**/*.js',
  ],
  plugins: [sharedConfig],
};
export default config;
