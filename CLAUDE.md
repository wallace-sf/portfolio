# Claude — Portfolio Monorepo

## 🧠 Papel e Identidade

Você é um engenheiro de software sênior especialista em TypeScript, DDD, Clean Architecture e ecossistema Next.js.
Antes de escrever qualquer código, pense na arquitetura, nos padrões aplicáveis e nos testes.
Sempre priorize código limpo, testável, extensível e alinhado com as camadas definidas abaixo.

---

## 📁 Estrutura do Monorepo

```
apps/
  web/          → Portfólio público (Next.js 14+ App Router)
  blog/         → Blog (Next.js — futuro, pós MVP)
  api/          → Backend (Next.js API Routes)

packages/
  core/         → Domain + Shared Kernel (entidades, VOs, interfaces de repositório, Domain Events)
  application/  → Use Cases, DTOs, ports (interfaces de serviços externos)
  infra/        → Repositórios concretos (Prisma + Supabase), serviços externos
  ui/           → Design system compartilhado (componentes React puros)
  markdown/     → Parser e renderer MDX/Markdown compartilhado
  i18n/         → Traduções compartilhadas entre apps
  eslint-config/
  typescript-config/
```

---

## 🏛️ Clean Architecture — Regra de Dependência

As dependências apontam **somente para dentro**:

```
core ← application ← infra ← web/api
```

### Restrições por camada

**packages/core**

- Proibido importar: React, Next.js, Prisma, Axios, qualquer lib externa
- Permitido: apenas TypeScript puro e outros módulos do próprio core
- É o núcleo do sistema — zero dependências externas

**packages/application**

- Proibido importar: React, Next.js, Prisma, libs de HTTP
- Permitido: importar de `core`, definir interfaces (ports) para infraestrutura
- Use Cases orquestram entidades — nunca acessam banco diretamente

**packages/infra**

- Implementa as interfaces (ports) definidas em `core`
- Repositórios concretos com Prisma + Supabase, serviços externos
- Conhece `core` e `application`, nunca o contrário

**apps/web e apps/api (Presentation)**

- Consome use cases via Server Components ou API Routes
- Nunca importa diretamente de repositórios concretos
- Componentes React não contêm lógica de negócio

---

## 🧩 DDD — Domain-Driven Design

### Bounded Contexts

```
┌──────────────────────┐  ┌─────────────────────┐  ┌──────────────────┐
│  Portfolio Context   │  │   Blog Context       │  │  Contact Context │
│  - Project           │  │   (futuro)           │  │  - Message       │
│  - Experience        │  │  - Post              │  │                  │
│  - Profile           │  │  - Tag               │  │                  │
│  - Skill             │  │  - Category          │  │                  │
└──────────────────────┘  └─────────────────────┘  └──────────────────┘
         ↑                          ↑
         └────── Shared Kernel ─────┘
              Markdown, Slug, DateRange, Tag, Technology, Image
```

### Regras entre contextos

- Contextos **não importam uns aos outros** diretamente
- Apenas o **Shared Kernel** é compartilhado entre contextos
- Exports públicos por contexto:
  - `@repo/core/portfolio`
  - `@repo/core/blog`
  - `@repo/core/shared`

### Estrutura interna de packages/core

```
packages/core/src/
  shared/
    either.ts             → Either<L, R> pattern
    errors/
      domain-error.ts     → Classe base abstrata
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
    index.ts              → stub (futuro)
  contact/
    entities/
      message.entity.ts
  ARCHITECTURE.md         → ADR descrevendo bounded contexts e regras
```

### Padrões de implementação DDD

**Either Pattern — obrigatório para erros de domínio**

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
    const slug = raw.toLowerCase().replace(/\s+/g, "-");
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

**Repository — interface no core**

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

### Regras DDD obrigatórias

- Entidades nunca expostas com setters públicos — use métodos com semântica de negócio
- Value Objects são imutáveis e possuem método `equals()`
- Aggregates protegem invariantes — nunca modifique filhos diretamente
- Domain Events para comunicação entre contextos
- **Nunca `throw` para erros de negócio** — use Either pattern
- `Profile` suporta no máximo 6 projetos em destaque (`featuredProjectSlugs.length <= 6`)

---

## ⚙️ Design Patterns (GoF)

Aplique somente quando resolverem um problema real. Comente com `// Pattern: <Nome>`.

- **Factory Method**: criação de entidades com `Entity.create()`
- **Repository**: abstrair acesso a dados no core
- **Adapter**: isolar libs externas (ORM, HTTP) da camada de application
- **Strategy**: variar comportamento de renderização de markdown
- **Observer**: Domain Events entre bounded contexts
- **Decorator**: cache, log e validação sem alterar classes originais
- **Builder**: construção de objetos complexos com muitos parâmetros opcionais

---

## ⚡ Next.js App Router (apps/web)

### Server vs Client Components

- Por padrão, todos os componentes são **Server Components**
- Use `"use client"` apenas para: hooks de estado, eventos, browser APIs
- Busque dados em Server Components com `async/await` — nunca `useEffect` para dados
- Nunca coloque lógica de negócio em componentes React

```typescript
// ✅ Server Component consome use case
export default async function ProjectsPage() {
  const useCase = container.resolve(GetPublishedProjectsUseCase)
  const result = await useCase.execute({ locale: 'pt-BR' })
  if (result.isLeft()) notFound()
  return <ProjectList projects={result.value} />
}
```

### Estrutura interna de apps/web

```
apps/web/src/
  app/                    → App Router
    [locale]/
      page.tsx            → Home
      projects/
        page.tsx          → Lista de projetos
        [slug]/
          page.tsx        → Detalhe do projeto
          loading.tsx
          error.tsx
      about/
        page.tsx          → Experiências
      loading.tsx
      error.tsx
      not-found.tsx
  api/
    v1/
      projects/
        [slug]/
          route.ts        → GET /api/v1/projects/:slug
  components/
    ui/                   → Primitivos visuais (Button, Input, Card)
    features/             → Componentes de domínio (ProjectCard, ExperienceCard)
    layouts/              → Header, Sidebar, Footer
  hooks/                  → Custom hooks reutilizáveis
  queries/                → TanStack Query — query key factories por domínio
  schemas/                → Schemas Zod por formulário/entidade
  lib/                    → Configurações (queryClient, container DI, envelope API)
```

### API Response Envelope

```typescript
// Sucesso
{ data: T, error: null, meta?: {...} }

// Falha
{ data: null, error: { code: string, message: string, details?: unknown }, meta?: {...} }
```

### Mapeamento de erros HTTP

- `NotFoundError` → 404
- `ValidationError` / `DomainError` → 400
- Erros inesperados → 500

### Rotas e Navegação

- Use `next/navigation` — nunca `next/router`
- Sempre `next/image` — nunca `<img>`
- Sempre `next/link` — nunca `<a>` para rotas internas
- Crie `loading.tsx` e `error.tsx` por segmento de rota

---

## 🔄 TanStack Query

```typescript
// queries/projects.ts — Query Key Factory obrigatório
export const projectKeys = {
  all: ["projects"] as const,
  lists: () => [...projectKeys.all, "list"] as const,
  detail: (slug: string) => [...projectKeys.all, "detail", slug] as const,
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

- Nunca misture TanStack Query com `useEffect` para busca de dados
- Trate sempre `isPending` e `isError` nos componentes
- Mutations sempre invalidam queries relacionadas no `onSuccess`

---

## 🛡️ Zod

- Centralize schemas em `src/schemas/` por entidade
- Derive tipos com `z.infer<>` — nunca declare tipos duplicados
- Valide respostas de API com `.safeParse()` para evitar runtime errors
- Integre com React Hook Form via `@hookform/resolvers/zod`
- Sempre valide bodies de Server Actions com Zod antes de processar

---

## 🎨 Tailwind CSS

- Use `cn()` (clsx + tailwind-merge) para classes condicionais
- Nunca use `style={{}}` para layout — use Tailwind
- Tokens de design no `tailwind.config.ts` — nunca cores hardcoded
- Dark mode via `class` strategy
- Extraia componente quando ultrapassar ~8 classes utilitárias inline

---

## 📦 Turborepo

### turbo.json — tasks obrigatórias

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

### Ordem de build no monorepo

```
packages/core → packages/application → packages/infra
                                     → apps/web
                                     → apps/blog (futuro)
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

## 🔒 ESLint — Proteção de Arquitetura

```js
// packages/eslint-config/core.js — regras para packages/core
module.exports = {
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: ["@prisma/*", "prisma"],
            message: "core cannot import infrastructure (Prisma)",
          },
          { group: ["next/*", "next"], message: "core cannot import Next.js" },
          {
            group: ["react", "react-dom"],
            message: "core cannot import React",
          },
          {
            group: ["axios", "node-fetch"],
            message: "core cannot import HTTP clients",
          },
        ],
      },
    ],
  },
};
```

---

## 🧪 TDD / Testes

### Stack

- **Vitest** + **Testing Library** — unitários e componentes
- **Playwright** — E2E

### Ciclo obrigatório: Red → Green → Refactor

### O que testar por camada

- **core**: 100% de cobertura — entidades, VOs, regras de negócio
- **application**: use cases com repositórios mockados
- **web**: componentes críticos com Testing Library
- **E2E**: fluxos principais com Playwright

### Template de teste

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

### Nomenclatura de testes

`should <comportamento esperado> when <contexto>`

---

## ✅ Padrões Gerais

- `strict: true` em todos os tsconfigs
- Evite `any` — use tipos explícitos ou `unknown`
- Funções com responsabilidade única (SRP)
- Nomes em **inglês** para código
- Máximo **200 linhas por arquivo**
- Imports organizados: libs externas → packages internos → relativos

---

## 🚫 Anti-patterns — Nunca Fazer

- Lógica de negócio em componentes React, controllers ou repositórios
- Importar Prisma/ORM dentro de `core` ou `application`
- `useEffect` para busca de dados — use TanStack Query ou Server Components
- `throw` para erros de domínio — use Either pattern
- Setters públicos em entidades — use métodos com semântica de negócio
- `any` em tipos de resposta de API — valide com Zod
- `<img>` e `<a>` para navegação interna no Next.js
- Strings mágicas — use enums ou constantes tipadas
- Testes que testam implementação em vez de comportamento
- Dependências circulares entre packages do monorepo
- Imports diretos entre bounded contexts — use apenas Shared Kernel

## Task Master AI Instructions
**Import Task Master's development workflow commands and guidelines, treat as if import is in the main CLAUDE.md file.**
@./.taskmaster/CLAUDE.md
