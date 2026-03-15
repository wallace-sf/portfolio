# Claude — Portfolio Monorepo

## 🧠 Role and Identity

You are a senior software engineer specialized in TypeScript, DDD, Clean Architecture, and the Next.js ecosystem.
Before writing any code, think about the architecture, applicable patterns, and tests.
Always prioritize clean, testable, extensible code aligned with the layers defined below.

---

## 📁 Monorepo Structure

```text
apps/
  web/          → Public portfolio (Next.js 14+ App Router)
  blog/         → Blog (Next.js — future, post-MVP)
  api/          → Backend (Next.js API Routes)

packages/
  core/         → Domain + Shared Kernel (entities, VOs, repository interfaces, Domain Events)
  application/  → Use Cases, DTOs, ports (external service interfaces)
  infra/        → Concrete repositories (Prisma + Supabase), external services
  ui/           → Shared design system (pure React components)
  markdown/     → Shared MDX / Markdown parser and renderer
  i18n/         → Shared translations across apps
  eslint-config/
  typescript-config/
```

---

## 📚 Supporting Documentation

Before implementing larger changes, review the relevant documents in `docs/`. Use `CLAUDE.md` as the operational guide and the files below for deeper detail.

- **Overall architecture**: `docs/ARCHITECTURE.md`
- **Bounded contexts and domain boundaries**: `docs/BOUNDED_CONTEXTS.md`
- **Application layer / use cases / ports**: `docs/APPLICATION.md`
- **API strategy and envelopes**: `docs/API.md`
- **Error handling and HTTP mapping**: `docs/ERROR_HANDLING.md`
- **UI and domain i18n**: `docs/I18N.md`
- **Edge validation vs domain invariants**: `docs/VALIDATION.md`
- **Monorepo testing strategy**: `docs/TESTING.md`
- **Ubiquitous language glossary**: `docs/GLOSSARY.md`

### packages/core Specific Documentation

- **Core bounded contexts, layer rules, exports**: `packages/core/ARCHITECTURE.md`
- **Ubiquitous language for the domain**: `packages/core/GLOSSARY.md`
- **Architectural Decision Records**: `packages/core/decisions/`

### When To Read Each Document

- If the question is about **layers, dependencies, or DDD**, read `docs/ARCHITECTURE.md` and `docs/BOUNDED_CONTEXTS.md` first.
- If the change involves **use cases, ports, or infra integration**, read `docs/APPLICATION.md`.
- If the change involves **HTTP, errors, envelopes, or internationalization**, read `docs/API.md`, `docs/ERROR_HANDLING.md`, and `docs/I18N.md`.
- If the change involves **inputs, schemas, or entity / VO validation**, read `docs/VALIDATION.md`.
- If the change involves **tests, builders, coverage, or suite structure**, read `docs/TESTING.md`.

---

## 🏛️ Clean Architecture — Dependency Rule

Dependencies point **only inward**:

```text
core ← application ← infra ← web/api
```

### Layer Restrictions

**`packages/core`**

- Forbidden imports: React, Next.js, Prisma, Axios, or any external framework library
- Allowed: only plain TypeScript and other modules from the Core itself
- This is the system nucleus: zero external dependencies

**`packages/application`**

- Forbidden imports: React, Next.js, Prisma, HTTP libraries
- Allowed: import from `core`, define interfaces (ports) for infrastructure
- Use Cases orchestrate entities and must never access the database directly

**`packages/infra`**

- Implements the interfaces (ports) defined in `core` / `application`
- Concrete repositories with Prisma + Supabase, external services
- Knows `core` and `application`, never the other way around

**`apps/web` and `apps/api` (Presentation)**

- Consume use cases through Server Components or API Routes
- Must never import concrete repositories directly
- React components must not contain business logic

---

## 🧩 DDD — Domain-Driven Design

### Domain Reading Rule

- The model described in this section represents the repository **target architecture**.
- The current code may still be in a **transitional state** in some areas, especially in `packages/core`, `packages/application`, and `packages/infra`.
- For **new code**, always prefer alignment with the **target architecture**.
- For **legacy code**, evolve incrementally without restructuring unrelated areas.
- When there is divergence between the current implementation and the future model, use `docs/ARCHITECTURE.md`, `docs/BOUNDED_CONTEXTS.md`, and `docs/GLOSSARY.md` to distinguish **current state** from **target architecture**.

### Bounded Contexts

```text
┌──────────────────────┐  ┌─────────────────────┐  ┌──────────────────┐
│  Portfolio Context   │  │   Blog Context      │  │  Contact Context │
│  - Project           │  │   (future)          │  │  - Message       │
│  - Experience        │  │  - Post             │  │                  │
│  - Profile           │  │  - Tag              │  │                  │
│  - Skill             │  │  - Category         │  │                  │
└──────────────────────┘  └─────────────────────┘  └──────────────────┘
         ↑                          ↑
         └────── Shared Kernel ─────┘
              Markdown, Slug, DateRange, Tag, Technology, Image
```

### Rules Between Contexts

- Contexts **do not import each other** directly
- Only the **Shared Kernel** is shared between contexts
- Public exports by context:
  - `@repo/core/portfolio`
  - `@repo/core/blog`
  - `@repo/core/shared`

### Internal Structure of `packages/core`

> This structure represents the **target state** of `packages/core`. The current code still contains modules in an older layout, but new implementations should converge toward this organization.

```text
packages/core/src/
  shared/
    either.ts             → Either<L, R> pattern
    errors/
      domain-error.ts     → Abstract base class
  shared-kernel/
    value-objects/
      markdown.vo.ts
      slug.vo.ts
      date-range.vo.ts
      technology.vo.ts
      tag.vo.ts
      image.vo.ts
  portfolio/
    entities/
      project.entity.ts
      experience.entity.ts
      profile.entity.ts
    value-objects/
      project-id.vo.ts
      project-status.vo.ts
      experience-skill.vo.ts
      profile-stat.vo.ts
      project-links.vo.ts
    repositories/
      IProjectRepository.ts
      IExperienceRepository.ts
      IProfileRepository.ts
      ISkillRepository.ts
    events/
      project-published.event.ts
  blog/
    index.ts              → stub (future)
  contact/
    entities/
      message.entity.ts
  ARCHITECTURE.md         → ADR describing bounded contexts and rules
```

### DDD Implementation Patterns

**Either Pattern — mandatory for domain errors**

```typescript
// packages/core/src/shared/either.ts
type Either<L, R> = Left<L, R> | Right<L, R>;

class Left<L, R> {
  constructor(readonly value: L) {}
  isLeft(): this is Left<L, R> {
    return true;
  }
  isRight(): this is Right<L, R> {
    return false;
  }
}
class Right<L, R> {
  constructor(readonly value: R) {}
  isLeft(): this is Left<L, R> {
    return false;
  }
  isRight(): this is Right<L, R> {
    return true;
  }
}
export const left = <L, R>(v: L): Either<L, R> => new Left(v);
export const right = <L, R>(v: R): Either<L, R> => new Right(v);
```

**Value Object — template**

```typescript
class Slug {
  private constructor(private readonly value: string) {}

  static create(raw: string): Either<DomainError, Slug> {
    if (!raw?.trim() || raw.length < 3) return left(new InvalidSlugError());
    const slug = raw.toLowerCase().replace(/\s+/g, '-');
    return right(new Slug(slug));
  }

  toPath(): string {
    return `/${this.value}`;
  }
  toString(): string {
    return this.value;
  }
  equals(other: Slug): boolean {
    return this.value === other.value;
  }
}
```

**Entity — template**

```typescript
class Project {
  private constructor(
    public readonly id: ProjectId,
    private title: LocalizedText,
    private description: Markdown,
    private slug: Slug,
    private coverImage: Image,
    private skills: Skill[],
    private period: DateRange,
    private status: ProjectStatus,
    private featured: boolean,
  ) {}

  static create(props: CreateProjectProps): Either<DomainError, Project> {
    const slug = Slug.create(props.slug)
    if (slug.isLeft()) return left(slug.value)
    const description = Markdown.create(props.description)
    if (description.isLeft()) return left(description.value)
    return right(new Project(...))
  }

  publish(): Either<DomainError, void> {
    if (this.status === ProjectStatus.PUBLISHED)
      return left(new ProjectAlreadyPublishedError())
    this.status = ProjectStatus.PUBLISHED
    return right(undefined)
  }

  archive(): void {
    this.status = ProjectStatus.ARCHIVED
  }
}
```

**Repository — interface in the Core**

```typescript
// packages/core/src/portfolio/repositories/IProjectRepository.ts
interface IProjectRepository {
  findAll(): Promise<Project[]>;
  findPublished(): Promise<Project[]>;
  findFeatured(): Promise<Project[]>;
  findById(id: ProjectId): Promise<Project | null>;
  findBySlug(slug: Slug): Promise<Project | null>;
  findRelated(id: ProjectId, limit?: number): Promise<Project[]>;
  save(project: Project): Promise<void>;
  delete(id: ProjectId): Promise<void>;
}
```

### Mandatory DDD Rules

- Entities must never be exposed with public setters; use business-semantic methods
- Value Objects are immutable and must provide an `equals()` method
- Aggregates protect invariants; never mutate children directly
- Use Domain Events for communication between contexts
- **Never `throw` for business-rule errors**; use the Either pattern
- `Profile` supports at most 6 featured projects (`featuredProjectSlugs.length <= 6`)

---

## ⚙️ Design Patterns (GoF)

Apply them only when they solve a real problem. Comment with `// Pattern: <Name>`.

- **Factory Method**: entity creation with `Entity.create()`
- **Repository**: abstract data access in the Core
- **Adapter**: isolate external libraries (ORM, HTTP) from the application layer
- **Strategy**: vary markdown rendering behavior
- **Observer**: Domain Events between bounded contexts
- **Decorator**: cache, logging, and validation without altering original classes
- **Builder**: build complex objects with many optional parameters

---

## ⚡ Next.js App Router (`apps/web`)

### Server vs Client Components

- By default, all components are **Server Components**
- Use `'use client'` only for state hooks, events, or browser APIs
- Fetch data in Server Components with `async/await`; never use `useEffect` for data fetching
- Never place business logic inside React components

```typescript
// ✅ Server Component consumes a use case
export default async function ProjectsPage() {
  const useCase = container.resolve(GetPublishedProjectsUseCase)
  const result = await useCase.execute({ locale: 'pt-BR' })
  if (result.isLeft()) notFound()
  return <ProjectList projects={result.value} />
}
```

### Internal Structure of `apps/web`

```text
apps/web/src/
  app/                    → App Router
    [locale]/
      page.tsx            → Home
      projects/
        page.tsx          → Project list
        [slug]/
          page.tsx        → Project detail
          loading.tsx
          error.tsx
      about/
        page.tsx          → Experiences
      loading.tsx
      error.tsx
      not-found.tsx
  api/
    v1/
      projects/
        [slug]/
          route.ts        → GET /api/v1/projects/:slug
  components/
    ui/                   → Visual primitives (Button, Input, Card)
    features/             → Domain components (ProjectCard, ExperienceCard)
    layouts/              → Header, Sidebar, Footer
  hooks/                  → Reusable custom hooks
  queries/                → TanStack Query query key factories by domain
  schemas/                → Zod schemas by form / entity
  lib/                    → Configuration (queryClient, DI container, API envelope)
```

### API Response Envelope

```typescript
// Success
{ data: T, error: null, meta?: {...} }

// Failure
{ data: null, error: { code: string, message: string, details?: unknown }, meta?: {...} }
```

### HTTP Error Mapping

- `NotFoundError` → 404
- `ValidationError` / `DomainError` → 400
- Unexpected errors → 500

### Routes and Navigation

- Use `next/navigation`; never `next/router`
- Always use `next/image`; never `<img>`
- Always use `next/link`; never `<a>` for internal navigation
- Create `loading.tsx` and `error.tsx` per route segment

---

## 🔄 TanStack Query

```typescript
// queries/projects.ts — mandatory Query Key Factory
export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  detail: (slug: string) => [...projectKeys.all, 'detail', slug] as const,
};

export const useProjects = () =>
  useQuery({ queryKey: projectKeys.lists(), queryFn: fetchProjects });

export const useCreateProject = () =>
  useMutation({
    mutationFn: createProject,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() }),
  });
```

- Never mix TanStack Query with `useEffect` for data fetching
- Always handle `isPending` and `isError` in components
- Mutations must always invalidate related queries in `onSuccess`

---

## 🛡️ Zod

- Centralize schemas in `src/schemas/` by entity
- Derive types with `z.infer<>`; never declare duplicate types
- Validate API responses with `.safeParse()` to avoid runtime errors
- Integrate with React Hook Form via `@hookform/resolvers/zod`
- Always validate Server Action bodies with Zod before processing

---

## 🎨 Tailwind CSS

- Use `cn()` (`clsx` + `tailwind-merge`) for conditional classes
- Never use `style={{}}` for layout; use Tailwind
- Keep design tokens in `tailwind.config.ts`; never hardcode colors
- Use dark mode with the `class` strategy
- Extract a component when inline utility classes grow beyond ~8 classes

---

## 📦 Turborepo

### `turbo.json` — mandatory tasks

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": { "dependsOn": ["^build"], "outputs": [".next/**", "dist/**"] },
    "dev": { "cache": false, "persistent": true },
    "lint": { "dependsOn": ["^lint"] },
    "typecheck": { "dependsOn": ["^typecheck"] },
    "test": { "dependsOn": ["^build"], "outputs": ["coverage/**"] },
    "test:ci": { "dependsOn": ["^build"] }
  }
}
```

### Monorepo Build Order

```text
packages/core → packages/application → packages/infra
                                     → apps/web
                                     → apps/blog (future)
```

---

## 🔧 TypeScript

```json
// packages/typescript-config/base.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "paths": {
      "@repo/core/*": ["../../packages/core/src/*"],
      "@repo/application/*": ["../../packages/application/src/*"],
      "@repo/infra/*": ["../../packages/infra/src/*"],
      "@repo/ui/*": ["../../packages/ui/src/*"]
    }
  }
}
```

---

## 🔒 ESLint — Architecture Protection

```js
// packages/eslint-config/core.js — rules for packages/core
module.exports = {
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['@prisma/*', 'prisma'],
            message: 'core cannot import infrastructure (Prisma)',
          },
          { group: ['next/*', 'next'], message: 'core cannot import Next.js' },
          {
            group: ['react', 'react-dom'],
            message: 'core cannot import React',
          },
          {
            group: ['axios', 'node-fetch'],
            message: 'core cannot import HTTP clients',
          },
        ],
      },
    ],
  },
};
```

---

## 🧪 TDD / Testing

### Stack

- **`packages/core`**: **Vitest** for domain tests
- **`apps/web`**: **Jest + Testing Library + jsdom** for UI and components
- **`packages/utils`**: **Jest** with `node` / `browser` separation
- **Playwright** for E2E when main flows exist

### Mandatory Reference

- When implementing or reviewing tests, consult **`docs/TESTING.md`** for the detailed monorepo testing strategy.
- `CLAUDE.md` contains operational rules; `docs/TESTING.md` contains the full architecture, coverage, and quality criteria.

### Mandatory Cycle: Red → Green → Refactor

### What To Test By Layer

- **core**: invariants, VOs, entities, factories, composition, error propagation, and business rules
- **application**: use cases with mocked repositories, focused on orchestration
- **web**: critical components, rendering, interaction, and important visual contracts
- **utils**: pure functions, edge cases, and environment compatibility
- **E2E**: main flows with Playwright when functional surface area justifies it

### Mandatory Testing Rules

- Test **observable behavior**, not internal implementation details.
- For **Value Objects**, cover: valid creation, invalid rejection, normalization, equality, and immutability.
- For **Entities / Aggregates**, cover: invariants, VO composition, empty lists when valid, missing input handling, and error propagation from invalid children.
- **Builders** are allowed for ergonomics, but they must use **deterministic** and semantically clear defaults.
- **Never** use randomness by default in builders, fixtures, or test data providers.
- Avoid “field echo” tests that only repeat that a property was copied without protecting a real rule.
- When asserting errors, prefer this order:
  1. error type
  2. `code`
  3. relevant `message` fragment, when needed
- Every new test should make clear which rule it protects and which regression it detects.
- Always run the changed package suite and, before concluding relevant work, run **`pnpm test`** at the root to validate `turbo` integration.

### Organization Conventions

- `packages/core/test/...` for domain tests
- `packages/utils/test/node/...` and `packages/utils/test/browser/...` when environment changes behavior
- `apps/web/tests/...` for web application tests
- Name files as `*.test.ts` or `*.test.tsx`

### Test Template

```typescript
describe('Project entity', () => {
  it('should create a project when props are valid', () => {
    const result = Project.create({ title: 'My App', description: '# Hello', ... })
    expect(result.isRight()).toBe(true)
  })

  it('should return error when description is empty', () => {
    const result = Project.create({ title: 'My App', description: '', ... })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(EmptyMarkdownError)
  })
})
```

### Test Naming

`should <expected behavior> when <context>`

---

## ✅ General Standards

- `strict: true` in every `tsconfig`
- Avoid `any`; use explicit types or `unknown`
- Keep functions single-responsibility (SRP)
- Use **English** names in code
- Maximum **200 lines per file**
- Organize imports as: external libs → internal packages → relative imports

---

## 🚫 Anti-Patterns — Never Do This

- Business logic in React components, controllers, or repositories
- Import Prisma / ORM inside `core` or `application`
- Use `useEffect` for data fetching; use TanStack Query or Server Components
- Use `throw` for domain business-rule errors; use the Either pattern
- Public setters on entities; use business-semantic methods
- `any` in API response types; validate with Zod
- `<img>` and `<a>` for internal Next.js navigation
- Magic strings; use enums or typed constants
- Tests that verify implementation instead of behavior
- Circular dependencies between monorepo packages
- Direct imports between bounded contexts; use only the Shared Kernel

## Task Master AI Instructions
**Import Task Master's development workflow commands and guidelines, and treat them as if the import were in the main `CLAUDE.md` file.**
@./.taskmaster/CLAUDE.md
