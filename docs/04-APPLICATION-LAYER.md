# 04 — Application Layer

> Use cases, ports, DTOs, and the orchestration pattern between domain and infrastructure.

---

## Goal

The application layer:
- **Orchestrates** the domain: use cases call repository ports and return data ready for the interface layer
- **Keeps Core pure**: Application depends on Core and defines port interfaces; Infrastructure implements them
- **Isolates delivery**: Web / API never access concrete repositories directly

---

## Abstract `UseCase` Base Class

All use cases extend the abstract base class defined in `packages/application/src/shared/UseCase.ts`:

```typescript
export abstract class UseCase<TInput, TOutput, TError = DomainError> {
  abstract execute(input: TInput): Promise<Either<TError, TOutput>>;
}
```

Concrete use cases inject their required port via the constructor and implement `execute()`:

```typescript
export class GetFeaturedProjects extends UseCase<GetFeaturedProjectsInput, ProjectSummaryDTO[]> {
  constructor(private readonly projectRepository: IProjectRepository) {
    super();
  }

  async execute(input: GetFeaturedProjectsInput): Promise<Either<DomainError, ProjectSummaryDTO[]>> {
    try {
      const projects = await this.projectRepository.findFeatured();
      return right(projects.map((p) => this.toDTO(p, input.locale)));
    } catch {
      return left(new DomainError('FETCH_FAILED', { message: 'Failed to fetch featured projects' }));
    }
  }
}
```

---

## Ports

Repository interfaces live in `@repo/core` (not in `@repo/application`). Service ports that are not related to the domain are defined in `@repo/application`:

| Port | Package | Status |
|------|---------|--------|
| `IProjectRepository` | `@repo/core/portfolio` | defined |
| `IExperienceRepository` | `@repo/core/portfolio` | defined |
| `IProfileRepository` | `@repo/core/portfolio` | defined |
| `IEmailService` | `@repo/application/contact` | ✅ implemented |

`IEmailService` signature:

```typescript
interface IEmailService {
  send(message: IContactMessageDTO): Promise<Either<DomainError, void>>;
}
```

---

## Use Cases

| Use case | Port(s) | Input | Output | Status |
|----------|---------|-------|--------|--------|
| `GetFeaturedProjects` | `IProjectRepository` | `{ locale }` | `ProjectSummaryDTO[]` | ✅ implemented |
| `GetPublishedProjects` | `IProjectRepository` | `{ locale }` | `ProjectSummaryDTO[]` | pending |
| `GetProjectBySlug` | `IProjectRepository` | `{ locale, slug }` | `ProjectDetailDTO` | pending |
| `GetExperiences` | `IExperienceRepository` | `{ locale }` | `ExperienceDTO[]` | pending |
| `GetProfile` | `IProfileRepository` | `{ locale }` | `ProfileDTO` | pending |
| `SendContactMessage` | `IEmailService` | `IContactMessageDTO` | `void` | pending |

Use cases **never** know Supabase, HTTP, or Prisma. Domain errors are propagated as `Either` and mapped at the edge.

---

## DTOs

DTOs are plain serializable types — no domain logic, no Either. They are the output contract of use cases, with all localized fields already resolved to a single string.

| DTO | File | Description |
|-----|------|-------------|
| `ProjectSummaryDTO` | `portfolio/dtos/ProjectSummaryDTO.ts` | Card / listing view |
| `ProjectDetailDTO` | `portfolio/dtos/ProjectDetailDTO.ts` | Detail page; extends `ProjectSummaryDTO` |
| `ExperienceDTO` | `portfolio/dtos/ExperienceDTO.ts` | Work experience entry |
| `ExperienceSkillDTO` | `portfolio/dtos/ExperienceSkillDTO.ts` | Skill inside an experience |
| `ProfileDTO` | `portfolio/dtos/ProfileDTO.ts` | Full profile |
| `ProfileStatDTO` | `portfolio/dtos/ProfileStatDTO.ts` | Single stat inside a profile |
| `SocialNetworkDTO` | `portfolio/dtos/SocialNetworkDTO.ts` | Social link |
| `IContactMessageDTO` | `contact/dtos/ContactMessageDTO.ts` | Input DTO for contact form |

```typescript
// ProjectSummaryDTO — output of GetFeaturedProjects
type ProjectSummaryDTO = {
  id: string;
  slug: string;
  title: string;
  caption: string;
  coverImage: { url: string; alt: string };
  theme?: string;
  skills: string[];
  publishedAt: string;
};

// ProjectDetailDTO — extends ProjectSummaryDTO
type ProjectDetailDTO = ProjectSummaryDTO & {
  content: string;
  summary?: string;
  objectives?: string;
  role?: string;
  team?: string;
  period: { startAt: string; endAt?: string };
  relatedProjects: ProjectSummaryDTO[];
};
```

---

## Current Structure

```text
packages/application/src/
  shared/
    UseCase.ts              ✅ abstract base class
  portfolio/
    dtos/
      ProjectSummaryDTO.ts  ✅
      ProjectDetailDTO.ts   ✅
      ExperienceDTO.ts      ✅
      ExperienceSkillDTO.ts ✅
      ProfileDTO.ts         ✅
      ProfileStatDTO.ts     ✅
      SocialNetworkDTO.ts   ✅
    use-cases/
      GetFeaturedProjects.ts ✅
  contact/
    dtos/
      ContactMessageDTO.ts  ✅
    ports/
      IEmailService.ts      ✅
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
