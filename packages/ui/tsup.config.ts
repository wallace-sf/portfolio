import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    'Control/index': 'src/Control/index.ts',
  }, // Arquivo de entrada
  dts: true, // Gera o arquivo index.d.ts
  format: ['cjs', 'esm'], // Formatos de saída (opcional, pode ser ajustado)
  sourcemap: true, // Inclui mapas de origem (opcional)
  clean: true, // Limpa a pasta de destino antes de gerar os arquivos
});
