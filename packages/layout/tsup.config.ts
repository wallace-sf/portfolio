import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'SiteHeader/index': 'src/SiteHeader/index.tsx',
    'SiteFooter/index': 'src/SiteFooter/index.tsx',
    'SiteLogo/index': 'src/SiteLogo/index.tsx',
    'SideNav/index': 'src/SideNav/index.tsx',
    'ThemeToggle/index': 'src/ThemeToggle/index.tsx',
    'LanguageSelector/index': 'src/LanguageSelector/index.tsx',
  },
  dts: true,
  format: ['cjs', 'esm'],
  sourcemap: true,
  clean: true,
  external: [
    'react',
    'react-dom',
    'next',
    'next-intl',
    '@repo/ui',
    '@repo/core',
    '@repo/tailwind-config',
  ],
  tsconfig: 'tsconfig.json',
});
