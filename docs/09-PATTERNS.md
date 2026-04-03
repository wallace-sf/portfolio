# 09 — Patterns

> DDD implementation patterns (Either, VO, Entity, Repository) and GoF design patterns used in this project.

---

## Either Pattern — mandatory for domain errors

**Never `throw` for business-rule errors.** Return `Either<Error, Value>` instead.

```typescript
// packages/core/src/shared/either.ts
type Either<L, R> = Left<L, R> | Right<L, R>;

class Left<L, R> {
  constructor(readonly value: L) {}
  isLeft(): this is Left<L, R> { return true; }
  isRight(): this is Right<L, R> { return false; }
}
class Right<L, R> {
  constructor(readonly value: R) {}
  isLeft(): this is Left<L, R> { return false; }
  isRight(): this is Right<L, R> { return true; }
}

export const left  = <L, R>(v: L): Either<L, R> => new Left(v);
export const right = <L, R>(v: R): Either<L, R> => new Right(v);
```

**Usage:**

```typescript
const result = Slug.create('my-project');
if (result.isLeft()) {
  // result.value is ValidationError
}
// result.value is Slug
```

---

## Value Object Template

```typescript
class Slug extends ValueObject<string> {
  static readonly ERROR_CODE = 'INVALID_SLUG';
  private static readonly SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

  private constructor(value: string) { super({ value }); }

  static create(raw?: string): Either<ValidationError, Slug> {
    const normalized = raw?.trim().toLowerCase() ?? '';
    const { error, isValid } = Validator.of(normalized)
      .length(3, 100, 'Slug must be at least 3 characters.')
      .regex(Slug.SLUG_REGEX, 'Slug must be kebab-case.')
      .validate();
    if (!isValid && error)
      return left(new ValidationError({ code: Slug.ERROR_CODE, message: error }));
    return right(new Slug(normalized));
  }

  toPath(): string { return `/${this.value}`; }
}
```

**Rules for Value Objects:**
- Immutable — no setters
- Must provide `equals()` (inherited from `ValueObject` base)
- Use `Validator` from `@repo/utils` for all validation
- Use stable `ERROR_CODE` constants

---

## `collect()` — batch Either validation

When composing multiple Value Objects in `create()`, use `collect()` instead of sequential `if (isLeft())` guards.

```typescript
import { collect, left, right } from '@repo/core/shared';

static create(props: IProjectProps): Either<ValidationError, Project> {
  const result = collect([
    Slug.create(props.slug),
    LocalizedText.create(props.title),
    Image.create(props.coverImage?.url, props.coverImage?.alt),
  ]);
  if (result.isLeft()) return left(result.value); // first error, fail-fast

  const [slug, title, coverImage] = result.value; // typed tuple

  return right(new Project(props, slug, title, coverImage));
}
```

**When to use `collect()` vs manual loop:**

| Situation | Pattern |
|-----------|---------|
| Multiple independent VOs created at once | `collect([...])` |
| An array of children that each need validation | manual `for` loop |
| An optional field that may or may not be created | manual `if (prop) { ... }` |

```typescript
// ✅ collect — 3 independent VOs
const result = collect([Name.create(p.name), Url.create(p.url), Text.create(p.icon)]);

// ✅ loop — variable-length children array
const skills: Skill[] = [];
for (const s of props.skills) {
  const r = Skill.create(s);
  if (r.isLeft()) return left(r.value);
  skills.push(r.value);
}

// ✅ optional field
let theme: LocalizedText | undefined;
if (props.theme) {
  const r = LocalizedText.create(props.theme);
  if (r.isLeft()) return left(r.value);
  theme = r.value;
}
```

---

## Entity Template

```typescript
class Project extends Entity<Project, IProjectProps> {
  private constructor(
    props: IProjectProps,
    public readonly slug: Slug,
    public readonly title: LocalizedText,
    private status: ProjectStatus,
  ) {
    super(props);
  }

  static create(props: IProjectProps): Either<ValidationError, Project> {
    const result = collect([
      Slug.create(props.slug),
      LocalizedText.create(props.title),
    ]);
    if (result.isLeft()) return left(result.value);
    const [slug, title] = result.value;

    return right(new Project(props, slug, title, props.status));
  }

  publish(): Either<ValidationError, void> {
    if (this.status === ProjectStatus.PUBLISHED)
      return left(new ValidationError({ code: 'ALREADY_PUBLISHED', message: '...' }));
    this.status = ProjectStatus.PUBLISHED;
    return right(undefined);
  }
}
```

**Rules for Entities:**
- Private constructor — always use `Entity.create()`
- No public setters — expose business-semantic methods (`publish()`, `archive()`)
- Compose Value Objects with `collect()` for independent fields; use manual loops for children arrays
- `Profile` supports at most 6 featured projects
- **VO vs primitive/enum:** expose rich or reused concepts as VOs (`Slug`, `Name`, `DateRange`); keep stable enums and simple primitives as-is and validate them directly in `create()` with `Validator.of(value).in([...])` or `.refine()`. See [CLAUDE.md — Entity properties: VO vs primitive + Validator](../CLAUDE.md).

---

## Repository Interface Template (in Core)

```typescript
// packages/core/src/portfolio/repositories/IProjectRepository.ts
interface IProjectRepository {
  findAll(): Promise<Project[]>;
  findPublished(): Promise<Project[]>;
  findFeatured(): Promise<Project[]>;
  findById(id: Id): Promise<Project | null>;
  findBySlug(slug: Slug): Promise<Project | null>;
  save(project: Project): Promise<void>;
  delete(id: Id): Promise<void>;
}
```

Interfaces live in `@repo/core`. Implementations live in `@repo/infra`.

---

## GoF Design Patterns

Apply only when solving a real problem. Comment with `// Pattern: <Name>`.

| Pattern | When used |
|---------|-----------|
| **Factory Method** | Entity creation via `Entity.create()` |
| **Repository** | Abstract data access; interface in Core, implementation in Infra |
| **Adapter** | Isolate external libraries (ORM, HTTP) from the application layer |
| **Strategy** | Vary Markdown rendering behavior |
| **Observer** | Domain Events between bounded contexts |
| **Decorator** | Cache, logging, or validation without altering original classes |
| **Builder** | Build complex objects with many optional parameters (e.g., test builders) |

---

## `apps/web` Patterns

```typescript
// ✅ Server Component — data via REST (use cases run inside Route Handlers only)
export default async function ProjectsPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/v1/projects?locale=pt-BR`, {
    cache: 'no-store',
  });
  const body = await res.json();
  if (!res.ok || body.error) notFound();
  return <ProjectList projects={body.data} />;
}
```

```typescript
// ✅ TanStack Query — Query Key Factory
export const projectKeys = {
  all:    ['projects'] as const,
  lists:  () => [...projectKeys.all, 'list'] as const,
  detail: (slug: string) => [...projectKeys.all, 'detail', slug] as const,
};

export const useCreateProject = () =>
  useMutation({
    mutationFn: createProject,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: projectKeys.lists() }),
  });
```

---

## See Also

- **[06-VALIDATION](./06-VALIDATION.md)** — Validator API and usage
- **[08-TESTING](./08-TESTING.md)** — How to test VOs and Entities
- **[10-GLOSSARY](./10-GLOSSARY.md)** — Either, VO, Entity, Repository definitions
