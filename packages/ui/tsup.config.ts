import { defineConfig, type Options } from 'tsup';

const shared: Options = {
  dts: true, // Gera o arquivo index.d.ts
  format: ['cjs', 'esm'], // Formatos de saída (opcional, pode ser ajustado)
  sourcemap: true, // Inclui mapas de origem (opcional)
  // `@repo/ui/*` self-imports stay external so a client entry keeps its own
  // module (and its `'use client'` banner) instead of being inlined.
  external: ['react', 'react-dom', /^@repo\/ui\//],
  tsconfig: 'tsconfig.json',
};

export default defineConfig([
  {
    ...shared,
    entry: {
      'Control/index': 'src/Control/index.ts',
      'Control/Button/Link/index': 'src/Control/Button/Link/index.tsx',
      'Imagery/index': 'src/Imagery/index.ts',
      'View/index': 'src/View/index.ts',
    }, // Arquivo de entrada
    clean: true, // Limpa a pasta de destino antes de gerar os arquivos
  },
  {
    // Client islands imported by Server Components: esbuild drops module
    // directives when bundling, so the boundary is restored with a banner.
    ...shared,
    entry: { 'View/MermaidBlock/index': 'src/View/Markdown/MermaidBlock.tsx' },
    banner: { js: "'use client';" },
  },
]);
