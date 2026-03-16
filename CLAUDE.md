# Claude — Portfolio Monorepo

## 🧠 Role and Identity

You are a senior software engineer specialized in TypeScript, DDD, Clean Architecture, and the Next.js ecosystem.
Before writing any code, think about the architecture, applicable patterns, and tests.
Always prioritize clean, testable, extensible code.

---

## 📁 Monorepo Structure

```text
apps/
  web/          → Public portfolio (Next.js 14+ App Router)
  blog/         → Blog (future, post-MVP)
  api/          → Backend (Next.js API Routes, future)

packages/
  core/         → Domain + Shared Kernel (entities, VOs, repository interfaces)
  application/  → Use Cases, DTOs, ports
  infra/        → Concrete repositories (Prisma + Supabase)
  ui/           → Shared design system (React components)
  markdown/     → MDX / Markdown parser
  i18n/         → Shared translations
  utils/        → Shared utilities (Validator, formatters)
```

---

## 📚 Complete Documentation

All project documentation lives in `docs/` with a numbered structure.

**Start here:** [`docs/INDEX.md`](./docs/INDEX.md)

| Topic | Document |
|-------|----------|
| Architecture and layers | [02-ARCHITECTURE](./docs/02-ARCHITECTURE.md) |
| DDD, contexts, aggregates | [03-BOUNDED-CONTEXTS](./docs/03-BOUNDED-CONTEXTS.md) |
| Use cases and ports | [04-APPLICATION-LAYER](./docs/04-APPLICATION-LAYER.md) |
| API envelope and error mapping | [05-API-CONTRACTS](./docs/05-API-CONTRACTS.md) |
| Validation strategy | [06-VALIDATION](./docs/06-VALIDATION.md) |
| Testing strategy | [08-TESTING](./docs/08-TESTING.md) |
| Code templates (Either, VO, Entity) | [09-PATTERNS](./docs/09-PATTERNS.md) |
| Domain and architectural terms | [10-GLOSSARY](./docs/10-GLOSSARY.md) |

---

## 🏛️ Core Principle — Dependency Rule

```text
core ← application ← infra ← web / api
```

- **`packages/core`**: zero framework dependencies (no React, Next.js, Prisma, Axios)
- **`packages/application`**: depends only on `core`; defines port interfaces
- **`packages/infra`**: implements ports; knows `core` and `application`
- **`apps/web` / `apps/api`**: presentation; calls application layer only

See [02-ARCHITECTURE](./docs/02-ARCHITECTURE.md) for full layer rules and ESLint enforcement.

---

## 🧩 DDD Code Templates

See [09-PATTERNS](./docs/09-PATTERNS.md) for full templates. Quick reference:

### Either Pattern

```typescript
export const left  = <L, R>(v: L): Either<L, R> => new Left(v);
export const right = <L, R>(v: R): Either<L, R> => new Right(v);

// Usage
const result = Slug.create('my-project');
if (result.isLeft()) return left(result.value);  // propagate error
const slug = result.value;                        // success
```

### Value Object

```typescript
class Slug extends ValueObject<string> {
  static readonly ERROR_CODE = 'INVALID_SLUG';
  private constructor(value: string) { super({ value }); }

  static create(raw?: string): Either<ValidationError, Slug> {
    const normalized = raw?.trim().toLowerCase() ?? '';
    const { error, isValid } = Validator.of(normalized)
      .length(3, 100, 'Slug must be at least 3 characters.')
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be kebab-case.')
      .validate();
    if (!isValid && error)
      return left(new ValidationError({ code: Slug.ERROR_CODE, message: error }));
    return right(new Slug(normalized));
  }
}
```

### Entity

```typescript
class Project extends Entity<Project, IProjectProps> {
  private constructor(props: IProjectProps, public readonly slug: Slug) { super(props); }

  static create(props: IProjectProps): Either<ValidationError, Project> {
    const slugResult = Slug.create(props.slug);
    if (slugResult.isLeft()) return left(slugResult.value);
    return right(new Project(props, slugResult.value));
  }

  publish(): Either<ValidationError, void> {
    if (this.status === 'PUBLISHED')
      return left(new ValidationError({ code: 'ALREADY_PUBLISHED', message: '...' }));
    this.status = 'PUBLISHED';
    return right(undefined);
  }
}
```

### Repository Interface

```typescript
interface IProjectRepository {
  findAll(): Promise<Project[]>;
  findBySlug(slug: Slug): Promise<Project | null>;
  save(project: Project): Promise<void>;
}
```

---

## 🔄 Development Workflow

### Issue → Branch → PR Protocol

1. **Confirm task** — ensure it exists in Task Master under the correct Sprint tag
2. **Verify work not done** — check: (a) `gh issue view <n>` — if closed, stop; (b) merged PRs; (c) git log; (d) existing branches
3. **Set Task Master to In Progress**: `task-master set-status --id=<id> --status=in-progress`
4. **Move GitHub issue to "In Progress"** in all linked Project boards
5. **Create branch from issue**: `gh issue develop <issue-number> --checkout`
6. **Implement** — code, tests, commits
7. **Open PR against `develop`**: `gh pr create --base develop`
8. **Set Task Master to Done**: `task-master set-status --id=<id> --status=done`

**Rules:**
- PRs always target `develop`.
- **Task Master status** mirrors Claude's work: `pending → in-progress → done` (done = PR created).
- **GitHub Projects board**: Claude sets `In Progress` when work begins. `In Review` and `Done` are the user's responsibility (after PR open and PR merge respectively). Claude must **never** move an issue to `Done`.
- Lock-file conflicts: `git checkout --theirs pnpm-lock.yaml && pnpm install`

---

## 🚫 Anti-Patterns

- Business logic in React components, controllers, or repositories
- Importing Prisma / ORM inside `core` or `application`
- `useEffect` for data fetching — use TanStack Query or Server Components
- `throw` for domain business-rule errors — use Either pattern
- Public setters on entities — use business-semantic methods
- `any` in types — use explicit types or `unknown`
- `<img>` or `<a>` for internal Next.js navigation
- Tests that verify implementation instead of behavior
- Direct imports between bounded contexts — use only the Shared Kernel

---

## ✅ General Standards

- `strict: true` in every `tsconfig`
- English names in code
- Maximum 200 lines per file
- Import order: external libs → internal packages → relative imports
- Test naming: `should <expected behavior> when <context>`

---

## Task Master AI Instructions

**Import Task Master's development workflow commands and guidelines.**
@./.taskmaster/CLAUDE.md
