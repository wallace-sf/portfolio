import sharedConfig from '@repo/tailwind-config';
import type { Config } from 'tailwindcss';

export default {
  content: [
    './stories/**/*.{js,ts,jsx,tsx}',
    'node_modules/@repo/ui/dist/**/*.js',
  ],
  plugins: [sharedConfig],
} satisfies Config;
