export const content = `A use case only talks to its ports, so a test only has to provide them. The question is how:
a stub per method, or a small working repository that keeps its data in memory.

## Stubs are fine for one call

The application tests here build a repository from \`vi.fn\` stubs and override the method the use
case calls:

\`\`\`ts
export function makeBlogPostRepository(
  overrides: Partial<IBlogPostRepository> = {},
): IBlogPostRepository {
  return { findAll: vi.fn(), findBySlug: vi.fn(), ...overrides };
}
\`\`\`

That works when one use case makes one call. It gets brittle when a page composes several use
cases over the same repository: each test has to know which method every use case reaches for,
and a refactor from \`findBySlug\` to \`findAll\` breaks tests even though the page still renders
the same thing.

## An in-memory repository is just another adapter

### The port is the contract

\`\`\`ts
export interface IBlogPostRepository {
  findAll(): Promise<BlogPost[]>;
  findBySlug(slug: Slug): Promise<BlogPost | null>;
}
\`\`\`

Prisma implements it in \`@repo/infra\`. Nothing stops a test from implementing it too.

### The test double

The page tests keep the posts in a variable and answer from it, so the test sets up **state**,
not calls:

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

Setting \`failure\` simulates a database outage without touching the use cases. The
\`FakeAuthenticationGateway\` in the identity tests follows the same idea with \`simulateError()\`.

### Data from a builder

\`BlogPostBuilder\` from \`@repo/core/testing\` creates valid domain entities, so the double only
ever holds posts that could exist in production:

\`\`\`ts
beforeEach(() => {
  posts = [ // [!code ++]
    blogPost('older-post', '2026-08-01T10:00:00.000Z').now(), // [!code ++]
    blogPost('draft-post', '2026-09-20T10:00:00.000Z', BlogPostStatus.DRAFT).now(), // [!code ++]
  ]; // [!code ++]
  repo.findAll.mockResolvedValue([olderPost, draftPost]); // [!code --]
});
\`\`\`

## What it buys you

- Tests describe a situation ("one draft, one published post") instead of a call sequence.
- Use cases can change which repository method they call without breaking page tests.
- The real filtering, sorting and mapping run, so the test checks behaviour, not wiring.

Keep the stubs for unit tests of a single use case. Reach for the in-memory version when the
test covers a page or a flow.
`;
