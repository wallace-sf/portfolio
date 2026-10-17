export const content = `Cada post de este blog vive en una URL con fecha, \`/{locale}/blog/{yyyy}/{MM}/{slug}\`, y cada una
de esas páginas es HTML generado en tiempo de build. Tres piezas pequeñas lo hacen funcionar.

## Una función lista todas las rutas

\`generateStaticParams\` devuelve los params de cada página a prerenderizar. La página del post y
su imagen OpenGraph necesitan exactamente la misma lista, así que vive en un archivo de route glue
junto a ellas:

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

Llama al mismo use case que el listado, así que un borrador nunca obtiene ruta: \`ListBlogPosts\`
solo devuelve posts publicados. El año y el mes vienen de \`publicationSegments\`, que lee la fecha
en UTC para que la zona horaria de la máquina de build no mueva un post a otro mes.

## Todo lo demás es 404

\`\`\`ts
export const dynamicParams = false;
export const generateStaticParams = blogPostStaticParams;
\`\`\`

Con \`dynamicParams = false\`, cualquier URL que no esté en la lista es un 404 en producción: un
slug desconocido, un post no publicado, o un slug real bajo el mes equivocado. Nada se renderiza
bajo demanda.

\`next dev\` lo ignora y renderiza cualquier params, así que la página vuelve a comprobar antes de
renderizar. Carga el post por slug y compara el año y el mes de la URL con su fecha de publicación;
si no coinciden, llama a \`notFound()\`. Los dos entornos dan la misma respuesta.

## El SEO sale de los mismos datos

La URL se construye en un solo lugar, \`blogPostPath(publishedAt, slug)\`, y todo lo que la necesita
la reutiliza:

- **Metadata**: la URL canónica y los alternates \`hreflang\` de cada locale vienen de
  \`buildAlternates(path, locale)\`.
- **Sitemap**: \`sitemap.ts\` llama a \`ListBlogPosts\` y pasa cada post por \`blogPostPath\` en cada
  locale.
- **Enlaces**: las cards, los breadcrumbs y el prev/next usan el mismo helper.

Como la lista de páginas, el sitemap y los enlaces leen el mismo use case y el mismo helper de
path, no pueden contradecirse. Un post que está en el sitemap tiene página, y una página siempre
tiene su URL canónica.
`;
