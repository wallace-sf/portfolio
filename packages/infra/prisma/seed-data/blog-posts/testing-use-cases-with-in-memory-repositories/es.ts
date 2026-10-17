export const content = `Un use case solo habla con sus ports, así que un test solo tiene que proporcionarlas. La
pregunta es cómo: un stub por método, o un pequeño repositorio funcional que guarda los datos en
memoria.

## Los stubs sirven para una llamada

Los tests de la capa de aplicación de este proyecto arman un repositorio con stubs \`vi.fn\` y
sobrescriben el método que llama el use case:

\`\`\`ts
export function makeBlogPostRepository(
  overrides: Partial<IBlogPostRepository> = {},
): IBlogPostRepository {
  return { findAll: vi.fn(), findBySlug: vi.fn(), ...overrides };
}
\`\`\`

Eso funciona cuando un use case hace una llamada. Se vuelve frágil cuando una página compone varios
use cases sobre el mismo repositorio: cada test tiene que saber qué método usa cada use case, y
cambiar \`findBySlug\` por \`findAll\` rompe tests aunque la página siga renderizando lo mismo.

## Un repositorio en memoria es solo otro adapter

### La port es el contrato

\`\`\`ts
export interface IBlogPostRepository {
  findAll(): Promise<BlogPost[]>;
  findBySlug(slug: Slug): Promise<BlogPost | null>;
}
\`\`\`

Prisma la implementa en \`@repo/infra\`. Nada impide que un test la implemente también.

### El doble de test

Los tests de página guardan los posts en una variable y responden desde ella, así que el test
prepara **estado**, no llamadas:

\`\`\`ts
let posts: BlogPost[] = [];
let failure: Error | null = null;

const inMemoryRepository: IBlogPostRepository = {
  findAll: async () => {
    if (failure) throw failure;
    return posts;
  },
  findBySlug: async () => null,
};
\`\`\`

Asignar \`failure\` simula una caída de la base de datos sin tocar los use cases. El
\`FakeAuthenticationGateway\` de los tests de identity sigue la misma idea con \`simulateError()\`.

### Datos desde un builder

El \`BlogPostBuilder\` de \`@repo/core/testing\` crea entidades de dominio válidas, así que el doble
solo guarda posts que podrían existir en producción:

\`\`\`ts
beforeEach(() => {
  posts = [ // [!code ++]
    blogPost('older-post', '2026-08-01T10:00:00.000Z').now(), // [!code ++]
    blogPost('draft-post', '2026-09-20T10:00:00.000Z', BlogPostStatus.DRAFT).now(), // [!code ++]
  ]; // [!code ++]
  repo.findAll.mockResolvedValue([olderPost, draftPost]); // [!code --]
});
\`\`\`

## Lo que ganas

- Los tests describen una situación ("un borrador, un post publicado") en lugar de una secuencia de
  llamadas.
- Los use cases pueden cambiar el método del repositorio que llaman sin romper los tests de página.
- El filtrado, el orden y el mapeo reales se ejecutan, así que el test verifica comportamiento, no
  cableado.

Conserva los stubs para tests unitarios de un único use case. Usa la versión en memoria cuando el
test cubre una página o un flujo.
`;
