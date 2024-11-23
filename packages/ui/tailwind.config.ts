import sharedConfig from '@repo/tailwind-config';
import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  plugins: [sharedConfig],
} satisfies Config;
