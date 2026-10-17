export const content = `Todo post deste blog vive numa URL datada, \`/{locale}/blog/{yyyy}/{MM}/{slug}\`, e cada uma dessas
páginas é HTML gerado em tempo de build. Três peças pequenas fazem isso funcionar.

## Uma função lista todas as rotas

O \`generateStaticParams\` devolve os params de cada página a pré-renderizar. A página do post e a
sua imagem OpenGraph precisam exatamente da mesma lista, então ela fica num arquivo de route glue
ao lado delas:

\`\`\`ts
export async function blogPostStaticParams(): Promise<BlogPostRouteParams[]> {
  const result = await new ListBlogPosts(
    getServerContainer().blogPostRepository,
  ).execute({ locale: DEFAULT_LOCALE });

  if (result.isLeft()) return [];

  return LOCALES.flatMap((locale) =>
    result.value.map(({ publishedAt, slug }) => ({
      locale,
      ...publicationSegments(publishedAt),
      slug,
    })),
  );
}
\`\`\`

Ela chama o mesmo use case da listagem, então um rascunho nunca ganha rota: o \`ListBlogPosts\` só
devolve posts publicados. O ano e o mês vêm de \`publicationSegments\`, que lê a data em UTC para
que o fuso horário da máquina de build não mude um post de mês.

## Todo o resto é 404

\`\`\`ts
export const dynamicParams = false;
export const generateStaticParams = blogPostStaticParams;
\`\`\`

Com \`dynamicParams = false\`, qualquer URL fora da lista é 404 em produção: um slug desconhecido,
um post não publicado, ou um slug real sob o mês errado. Nada é renderizado sob demanda.

O \`next dev\` ignora isso e renderiza qualquer params, então a página confere de novo antes de
renderizar. Ela carrega o post pelo slug e compara o ano e o mês da URL com a data de publicação;
se não batem, chama \`notFound()\`. Os dois ambientes dão a mesma resposta.

## O SEO sai dos mesmos dados

A URL é montada num lugar só, \`blogPostPath(publishedAt, slug)\`, e tudo que precisa dela a
reutiliza:

- **Metadata**: a URL canônica e os alternates \`hreflang\` de cada locale vêm de
  \`buildAlternates(path, locale)\`.
- **Sitemap**: o \`sitemap.ts\` chama \`ListBlogPosts\` e passa cada post por \`blogPostPath\` em
  cada locale.
- **Links**: cards, breadcrumbs e prev/next usam o mesmo helper.

Como a lista de páginas, o sitemap e os links leem o mesmo use case e o mesmo helper de path, eles
não têm como discordar. Um post que está no sitemap tem página, e uma página sempre tem a sua URL
canônica.
`;
