export const content = `Um use case só conversa com as suas ports, então um teste só precisa fornecê-las. A questão é
como: um stub por método, ou um pequeno repositório funcional que guarda os dados em memória.

## Stubs servem para uma chamada

Os testes da camada de aplicação daqui montam um repositório com stubs \`vi.fn\` e sobrescrevem o
método que o use case chama:

\`\`\`ts
export function makeBlogPostRepository(
  overrides: Partial<IBlogPostRepository> = {},
): IBlogPostRepository {
  return { findAll: vi.fn(), findBySlug: vi.fn(), ...overrides };
}
\`\`\`

Isso funciona quando um use case faz uma chamada. Fica frágil quando uma página compõe vários use
cases sobre o mesmo repositório: cada teste precisa saber qual método cada use case usa, e trocar
\`findBySlug\` por \`findAll\` quebra testes mesmo que a página continue renderizando a mesma coisa.

## Um repositório em memória é só mais um adapter

### A port é o contrato

\`\`\`ts
export interface IBlogPostRepository {
  findAll(): Promise<BlogPost[]>;
  findBySlug(slug: Slug): Promise<BlogPost | null>;
}
\`\`\`

O Prisma a implementa em \`@repo/infra\`. Nada impede um teste de implementá-la também.

### O dublê de teste

Os testes de página guardam os posts numa variável e respondem a partir dela, então o teste monta
**estado**, não chamadas:

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

Atribuir \`failure\` simula o banco fora do ar sem tocar nos use cases. O
\`FakeAuthenticationGateway\` dos testes de identity segue a mesma ideia com \`simulateError()\`.

### Dados vindos de um builder

O \`BlogPostBuilder\` de \`@repo/core/testing\` cria entidades de domínio válidas, então o dublê só
guarda posts que poderiam existir em produção:

\`\`\`ts
beforeEach(() => {
  posts = [ // [!code ++]
    blogPost('older-post', '2026-08-01T10:00:00.000Z').now(), // [!code ++]
    blogPost('draft-post', '2026-09-20T10:00:00.000Z', BlogPostStatus.DRAFT).now(), // [!code ++]
  ]; // [!code ++]
  repo.findAll.mockResolvedValue([olderPost, draftPost]); // [!code --]
});
\`\`\`

## O que você ganha

- Os testes descrevem uma situação ("um rascunho, um post publicado") em vez de uma sequência de
  chamadas.
- Os use cases podem trocar o método do repositório que chamam sem quebrar os testes de página.
- O filtro, a ordenação e o mapeamento reais rodam, então o teste verifica comportamento, não
  fiação.

Mantenha os stubs para testes unitários de um único use case. Use a versão em memória quando o
teste cobre uma página ou um fluxo.
`;
