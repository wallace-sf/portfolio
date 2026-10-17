export const content = `O corpo dos posts deste blog era MDX. Agora é Markdown puro, processado por um pipeline em que a
ordem dos passos é o modelo de segurança.

## Por que não MDX

MDX compila para JavaScript. Esse é o objetivo dele, e também o problema: o corpo de um post
guardado no banco vira código que o build executa. Nenhum post usava componente, um \`<\` ou \`{\`
solto quebrava a compilação, e um futuro app de admin teria que isolar cada edição. Então o corpo
virou Markdown no estilo do GitHub, que é dado.

## O pipeline

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

Não existe \`rehype-raw\`, então HTML escrito num post nunca é interpretado como HTML. E a linha
destacada faz o trabalho de verdade.

## Primeiro sanitiza, depois confia

O \`rehype-sanitize\` roda **logo depois** que o Markdown vira HTML, enquanto a árvore ainda tem só o
que o autor escreveu. Ele remove \`<script>\`, event handlers e URLs \`javascript:\`. O schema é o
padrão do GitHub, mais \`<mark>\` para os \`==destaques==\`.

Tudo depois dele é código deste repositório, não entrada, então pode acrescentar o que o
sanitizador removeria:

- O \`rehype-slug\` adiciona ids aos títulos. Rodá-lo depois do sanitizador mantém os ids como slugs
  simples, sem o prefixo \`user-content-\` que o sanitizador acrescenta. O sumário lê os mesmos ids.
- O \`rehypeMermaid\` transforma fences \`mermaid\` num elemento que uma ilha client renderiza.
- O \`rehype-pretty-code\` escreve atributos \`style\` e \`data-*\` inline para os dois temas de cor,
  os marcadores de diff e linhas destacadas como a de cima.

Inverta a ordem e você ganha um de dois bugs: o sanitizador remove o destaque, ou o destaque roda
sobre entrada não sanitizada.

## Rode uma vez por request

\`\`\`ts
export const markdownToHast = cache(
  async (markdown: string): Promise<Root> =>
    processor.run(processor.parse(markdown)),
);
\`\`\`

A página do post renderiza o corpo e monta o sumário a partir do mesmo conteúdo. O \`cache()\` do
React faz os dois lerem uma árvore só em vez de rodar o pipeline duas vezes.
`;
