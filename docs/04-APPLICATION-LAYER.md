# 04 — Application Layer

> Use cases, ports, DTOs, and the orchestration pattern between domain and infrastructure.

---

## Goal

The application layer:
- **Orchestrates** the domain: use cases call repository ports and return data ready for the interface layer
- **Keeps Core pure**: Application depends on Core and uses port interfaces; Infrastructure implements them
- **Server Components** in `apps/site` import `@repo/application` and call use cases directly at build time (SSG). The code never reaches the browser. **`'use client'` components** must never import `@repo/application` — they receive data as props. See [02-ARCHITECTURE](./02-ARCHITECTURE.md) and [05-API-CONTRACTS](./05-API-CONTRACTS.md)

---

## Abstract `UseCase` Base Class

Most use cases extend the abstract base class in `packages/application/src/shared/UseCase.ts`:

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

`SendContactMessage` follows the same orchestration style but does not extend `UseCase` (historical shape); it still returns `Either`.

---

## Ports

Repository interfaces for **Portfolio** and **Identity** live in `@repo/core`. Service ports not tied to a single aggregate are defined in `@repo/application`:

| Port | Package | Status |
|------|---------|--------|
| `IProjectRepository` | `@repo/core/portfolio` | defined |
| `IExperienceRepository` | `@repo/core/portfolio` | defined |
| `IProfileRepository` | `@repo/core/portfolio` | defined |
| `IUserRepository` | `@repo/core/identity` | defined |
| `IEmailService` | `@repo/application/contact` | implemented (`ResendEmailService` in `@repo/infra`) |
| `IAuthenticationGateway` | `@repo/application/identity` (planned) | **Planned** — sessão/sign-in sem acoplar o front ao IdP; ver [11-IDENTITY](./11-IDENTITY.md) |

The **authentication gateway** abstracts reading and establishing sessions from HTTP cookies. **Supabase** (or another IdP) lives only in an adapter in **`@repo/infra`**. The browser calls **`/api/v1/auth/*`** only.

`IEmailService` signature:

```typescript
interface IEmailService {
  send(message: IContactMessageDTO): Promise<Either<DomainError, void>>;
}
```

---

## Use Cases

### Portfolio

| Use case | Port(s) | Input | Output | Status |
|----------|---------|-------|--------|--------|
| `GetFeaturedProjects` | `IProjectRepository` | `{ locale }` | `ProjectSummaryDTO[]` | implemented |
| `GetPublishedProjects` | `IProjectRepository` | `{ locale }` | `ProjectSummaryDTO[]` | implemented |
| `GetProjectBySlug` | `IProjectRepository` | `{ locale, slug }` | `ProjectDetailDTO` | implemented |
| `GetExperiences` | `IExperienceRepository` | `{ locale }` | `ExperienceDTO[]` | implemented |
| `GetProfile` | `IProfileRepository` | `{ locale }` | `ProfileDTO` | implemented |

### Identity

Identity is modeled as its **own bounded context** in `packages/core` (`User`, `Role`, `IUserRepository`, `UnauthorizedError`). **Authorization** use cases take `userId` after the handler resolves session → `authSubject` → `User.id` (when `authSubject` and gateway exist). **Authentication** is delegated to **`IAuthenticationGateway`** at the composition root — not to React.

| Use case | Port(s) | Input | Output | Status |
|----------|---------|-------|--------|--------|
| `GetCurrentUser` | `IUserRepository` | `{ userId }` | `UserDTO` | implemented |
| `EnsureAdmin` | `IUserRepository` | `{ userId }` | `void` | implemented |
| `EnsureAppUserForAuthSession` | `IUserRepository` | `{ authSubject, email, defaultName? }` | application `userId` (`string`) | **planned** |

`EnsureAdmin` returns `UnauthorizedError` when the user exists but is not `Role.ADMIN`. Route handlers map that to **401** (see [05-API-CONTRACTS](./05-API-CONTRACTS.md)).

`EnsureAppUserForAuthSession` (planned): link `authSubject` to an existing `User` by email or create a `VISITOR`; used after sign-in and on `GET /api/v1/me`.

### Contact

| Use case | Port(s) | Input | Output | Status |
|----------|---------|-------|--------|--------|
| `SendContactMessage` | `IEmailService` | `SendContactMessageInput` | `void` | implemented |

Use cases **never** know Supabase, HTTP, or Prisma. Domain errors are propagated as `Either` and mapped at the edge.

---

## DTOs

DTOs are plain serializable types — no domain logic, no Either. They are the output (or input) contract of use cases, with localized fields resolved to a single string where applicable.

| DTO | Module | Description |
|-----|--------|-------------|
| `ProjectSummaryDTO` | portfolio | Card / listing view |
| `ProjectDetailDTO` | portfolio | Detail page; extends `ProjectSummaryDTO` |
| `ExperienceDTO` | portfolio | Work experience entry (`skills: string[]`) |
| `ProfileDTO` | portfolio | Full profile |
| `ProfileStatDTO` | portfolio | Stat inside a profile |
| `SocialNetworkDTO` | portfolio | Social link |
| `UserDTO` | identity | `id`, `name`, `email`, `role` |
| `IContactMessageDTO` | contact | Input shape for email send |

```typescript
// ProjectSummaryDTO — output of list/featured use cases
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
    UseCase.ts
  portfolio/
    dtos/
    use-cases/
      GetFeaturedProjects.ts
      GetPublishedProjects.ts
      GetProjectBySlug.ts
      GetExperiences.ts
      GetProfile.ts
  identity/
    dtos/
      UserDTO.ts
    ports/                    ← planned: IAuthenticationGateway
    use-cases/
      GetCurrentUser.ts
      EnsureAdmin.ts
      EnsureAppUserForAuthSession.ts   ← planned
  contact/
    dtos/
    ports/
      IEmailService.ts
    use-cases/
      SendContactMessage.ts
  index.ts
```

**Dependencies**: `@repo/core` only (plus `@repo/utils` where needed for validation helpers in contact). Must **not** depend on `@repo/infra`, `apps/site`, or `apps/admin`.

---

## Data flow

**Current: SSG — Server Components call use cases at build time:**

1. Server Component resolves locale and imports repository from `@repo/infra` via the container.
2. Calls `execute({ locale })` directly — no HTTP round-trip; runs at build time.
3. Use case returns `Either<DomainError, DTO[]>`; Server Component passes data as props to `'use client'` children.

```typescript
// ✅ Server Component — SSG pattern
const { projectRepository } = getServerContainer();
const result = await new GetPublishedProjects(projectRepository).execute({ locale });
if (result.isLeft()) notFound();
return <ProjectList projects={result.value} />;
```

**Future (planned):** when a dedicated REST backend is extracted, client components will fetch from `/api/v1/*` (TanStack Query); Server Components will continue calling use cases directly or switch to `fetch`.

**Authorization (admin):**

1. Handler reads **authenticated user id** from the session (middleware / cookie — infrastructure detail at the edge).
2. Handler calls `EnsureAdmin.execute({ userId })`; on `right`, proceeds; on `UnauthorizedError`, responds with **401**.

**`'use client'` components must never import `@repo/application`** — they receive data as props from Server Components.

---

## See Also

- **[02-ARCHITECTURE](./02-ARCHITECTURE.md)** — Layer dependency rule and REST boundary
- **[03-BOUNDED-CONTEXTS](./03-BOUNDED-CONTEXTS.md)** — Identity vs Portfolio
- **[05-API-CONTRACTS](./05-API-CONTRACTS.md)** — HTTP envelope and endpoints
- **[11-IDENTITY](./11-IDENTITY.md)** — Identity context and routes
- **[10-GLOSSARY](./10-GLOSSARY.md)** — Use Case, Port, DTO definitions
