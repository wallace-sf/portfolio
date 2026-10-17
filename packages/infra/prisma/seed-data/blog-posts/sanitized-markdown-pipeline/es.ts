export const content = `El cuerpo de los posts de este blog era MDX. Ahora es Markdown puro, procesado por un pipeline en
el que el orden de los pasos es el modelo de seguridad.

## Por qué no MDX

MDX compila a JavaScript. Ese es su objetivo, y también el problema: el cuerpo de un post guardado
en la base de datos se convierte en código que el build ejecuta. Ningún post usaba componentes, un
\`<\` o \`{\` suelto rompía la compilación, y una futura app de admin habría tenido que aislar cada
edición. Así que el cuerpo pasó a ser Markdown al estilo de GitHub, que es dato.

## El pipeline

\`\`\`ts {6}
const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkMark)
  .use(remarkRehype)
  .use(rehypeSanitize, sanitizeSchema)
  .use(rehypeSlug)
  .use(rehypeMermaid)
  .use(rehypePrettyCode, {
    theme: { dark: 'github-dark', light: 'github-light' },
    keepBackground: true,
    transformers: [transformerNotationDiff()],
  });
\`\`\`

No hay \`rehype-raw\`, así que el HTML escrito en un post nunca se interpreta como HTML. Y la línea
resaltada hace el trabajo de verdad.

## Primero sanitizar, después confiar

\`rehype-sanitize\` corre **justo después** de que el Markdown se convierte en HTML, mientras el
árbol todavía contiene solo lo que escribió el autor. Elimina \`<script>\`, event handlers y URLs
\`javascript:\`. El schema es el predeterminado de GitHub, más \`<mark>\` para los \`==resaltados==\`.

Todo lo que viene después es código de este repositorio, no entrada, así que puede añadir lo que
el sanitizador eliminaría:

- \`rehype-slug\` añade ids a los títulos. Ejecutarlo después del sanitizador deja los ids como slugs
  simples, sin el prefijo \`user-content-\` que añade el sanitizador. El índice lee los mismos ids.
- \`rehypeMermaid\` convierte los fences \`mermaid\` en un elemento que renderiza una isla client.
- \`rehype-pretty-code\` escribe atributos \`style\` y \`data-*\` inline para los dos temas de color,
  los marcadores de diff y las líneas resaltadas como la de arriba.

Invierte el orden y obtienes uno de dos bugs: el sanitizador elimina el resaltado, o el resaltado
corre sobre entrada sin sanitizar.

## Ejecútalo una vez por request

\`\`\`ts
export const markdownToHast = cache(
  async (markdown: string): Promise<Root> =>
    processor.run(processor.parse(markdown)),
);
\`\`\`

La página del post renderiza el cuerpo y arma el índice a partir del mismo contenido. El \`cache()\`
de React hace que ambos lean un único árbol en lugar de ejecutar el pipeline dos veces.
`;
