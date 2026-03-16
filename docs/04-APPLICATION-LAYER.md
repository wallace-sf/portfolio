# 04 — Application Layer

> Use cases, ports, DTOs, and the orchestration pattern between domain and infrastructure.

**Status: WIP** — `packages/application` is being introduced in Sprint 1.

---

## Goal

The application layer:
- **Orchestrates** the domain: use cases call repository ports and return data ready for the interface layer
- **Keeps Core pure**: Application depends on Core and defines port interfaces; Infrastructure implements them
- **Isolates delivery**: Web / API never access concrete repositories directly

---

## Ports

Interfaces defined in the application layer and implemented by infrastructure:

| Port | Planned methods |
|------|-----------------|
| `IProjectRepository` | `findAll()`, `findFeatured()`, `findPublished()`, `findBySlug(slug)`, `findById(id)` |
| `IExperienceRepository` | `findAll()` |
| `IProfileRepository` | `findOne()` |
| `ISkillRepository` | `findAll()` |
| `IContactSender` | `send(payload)` |

---

## Use Cases

| Use case | Port(s) | Input | Output |
|----------|---------|-------|--------|
| `GetFeaturedProjects` | `IProjectRepository` | — | `ProjectDTO[]` |
| `GetPublishedProjects` | `IProjectRepository` | `{ locale }` | `ProjectDTO[]` |
| `GetProjectBySlug` | `IProjectRepository` | `slug: string` | `ProjectDTO \| null` |
| `GetExperiences` | `IExperienceRepository` | `{ locale }` | `ExperienceDTO[]` |
| `GetProfile` | `IProfileRepository` | `{ locale }` | `ProfileDTO` |
| `SendContactMessage` | `IContactSender` | `{ name, email, subject, message }` | `{ ok }` or error |

Use cases **never** know Supabase, HTTP, or Prisma. Domain errors are propagated as `Either` and mapped at the edge.

---

## DTOs

DTOs are plain serializable objects — no domain logic. They are the output contract of use cases.

```typescript
// Example
interface ProjectDTO {
  id: string;
  slug: string;
  title: string;         // resolved for requested locale
  caption: string;
  content: string;
  skills: SkillDTO[];
  featured: boolean;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}
```

When a Core entity is directly serializable and sufficient, the use case may return it directly. Prefer explicit DTOs for summary listings or when the shape differs from the domain entity.

---

## Planned Structure

```text
packages/application/src/
  ports/
    IProjectRepository.ts
    IExperienceRepository.ts
    IProfileRepository.ts
    ISkillRepository.ts
    IContactSender.ts
  use-cases/
    GetFeaturedProjects.ts
    GetPublishedProjects.ts
    GetProjectBySlug.ts
    GetExperiences.ts
    GetProfile.ts
    SendContactMessage.ts
  dtos/
    ProjectDTO.ts
    ExperienceDTO.ts
    ProfileDTO.ts
    SkillDTO.ts
  index.ts
```

**Dependencies**: only `@repo/core` (and `@repo/utils` for shared types if needed). Must **not** depend on `@repo/infra`, `apps/web`, or `apps/api`.

---

## Read Flow Example

**List projects:**

1. `apps/web` (Server Component or Route Handler) calls `GetPublishedProjects.execute({ locale })`.
2. `GetPublishedProjects` calls `IProjectRepository.findPublished()`.
3. `@repo/infra` reads Supabase rows and maps them to `Project[]`.
4. Use case maps `Project[]` → `ProjectDTO[]` and returns.
5. `apps/web` renders the result or maps domain errors to HTTP status + localized message.

---

## See Also

- **[02-ARCHITECTURE](./02-ARCHITECTURE.md)** — Layer dependency rule
- **[05-API-CONTRACTS](./05-API-CONTRACTS.md)** — HTTP envelope and error mapping
- **[10-GLOSSARY](./10-GLOSSARY.md)** — Use Case, Port, DTO definitions
