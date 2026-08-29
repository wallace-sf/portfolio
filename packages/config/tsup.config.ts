import { defineConfig } from 'tsup';

export default defineConfig({
  entry: { index: 'src/index.ts' },
  dts: true,
  format: ['cjs', 'esm'],
  sourcemap: true,
  clean: true,
  tsconfig: 'tsconfig.json',
});
