# 03 — Bounded Contexts

> DDD contexts, aggregates, Shared Kernel, and the internal structure of `packages/core`.

---

## Context Map

| Context | Responsibility | Key models | Status |
|---------|----------------|------------|--------|
| **Portfolio** | Projects, experience, skills, profile, values | Project, Experience, Skill, ProfessionalValue, Language, SocialNetwork | Active |
| **Blog** | Posts, tags, publication | BlogPost, Tag | Stub (future) |
| **Contact** | Contact form capture and delivery | `SendContactMessage`, `IEmailService` | Application + infra (API route pending) |
| **Identity** | Authentication, authorization, roles | User, Role, `IUserRepository`, use cases in application | Active (domain + use cases; HTTP API in place) |
| **Shared Kernel** | Cross-context primitives | Id, Text, DateTime, Name, Url, enums, Either, errors | Active |

```text
                    ┌──────────────────┐
                    │  Shared Kernel   │
                    │  Id, Text, VO,   │
                    │  Entity, Errors  │
                    └────────┬─────────┘
                             │
         ┌───────────────────┼───────────────────┬───────────────────┐
         │                   │                   │                   │
         ▼                   ▼                   ▼                   ▼
┌────────────────┐  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐
│   Portfolio    │  │      Blog      │  │    Contact     │  │    Identity    │
│  Project       │  │   BlogPost     │  │  (DTOs/forms)  │  │  User, Role    │
│  Experience    │  │   Tag          │  │                │  │  IUserRepo     │
│  Skill, etc.   │  │                │  │                │  │  EnsureAdmin   │
└────────────────┘  └────────────────┘  └────────────────┘  └────────────────┘
```

---

## Rules Between Contexts

- Contexts **do not import each other** directly
- Only the **Shared Kernel** (`src/shared/`) is shared across all contexts
- Cross-context communication happens via **Domain Events** (Observer pattern), never direct imports

Public exports per context:

```typescript
import { Project, IProjectRepository } from '@repo/core/portfolio';
import { Slug, Either, ValidationError }  from '@repo/core/shared';
```

---

## Portfolio Context

**Responsibility:** projects, professional experience, skills, profile, values, languages, social links.

**Aggregates and entities:**

| Class | Role | Key invariant |
|-------|------|---------------|
| `Profile` | Aggregate root | `featuredProjectSlugs.length <= 6` |
| `Project` | Aggregate root | slug uniqueness, status transitions `DRAFT → PUBLISHED → ARCHIVED` |
| `Experience` | Aggregate root | `start_at <= end_at` when `end_at` is present |
| `Skill` | Entity | — |
| `Language` | Entity | — |
| `SocialNetwork` | Entity | — |
| `ProfessionalValue` | Entity | — |

**Value Objects within this context:**

- `ExperienceSkill` — `Skill` + contextual `LocalizedText` (work description)
- `ProfileStat` — metric with label + value + icon
- `ProjectStatus` — `DRAFT | PUBLISHED | ARCHIVED`

---

## Shared Kernel

**What belongs here:**
- `Entity`, `ValueObject`, `IEntityProps`
- `Id`, `Text`, `DateTime`, `Name`, `Url`
- `EmploymentType`, `LocationType`, `SkillType`, `Fluency`
- `Slug`, `Image`, `DateRange`, `LocalizedText`, `Email` (planned)
- `Either<L, R>`, `ValidationError`, `DomainError`, `NotFoundError`, `UnauthorizedError` (identity)
- `ERROR_MESSAGE` (domain error codes with `pt-BR` / `en-US` translations)

**What does not belong here:** rules specific to one context (e.g., "a post can only be published with at least one tag" belongs to Blog).

---

## `packages/core` Internal Structure

```text
src/
  shared/                       → Shared Kernel
    base/
      Entity.ts                 → Abstract base class
      ValueObject.ts            → Abstract base class
    either.ts                   → Either<L, R> (Left, Right, left(), right())
    errors/
      DomainError.ts            → Abstract base error
      ValidationError.ts        → Invariant violations
      NotFoundError.ts          → Lookup failures
    i18n/
      Locale.ts                 → Supported locales
      LocalizedText.ts          → Multi-language text VO
    vo/
      DateRange.ts, DateTime.ts, EmploymentType.ts, Fluency.ts
      Id.ts, Image.ts, LocationType.ts, Name.ts
      SkillType.ts, Slug.ts, Text.ts, Url.ts

  portfolio/                    → Portfolio bounded context
    entities/
      experience/model/         → Experience.ts, ExperienceSkill.ts
      language/model/           → Language.ts
      professional-value/model/ → ProfessionalValue.ts
      profile/model/            → Profile.ts, ProfileStat.ts
      project/model/            → Project.ts, ProjectStatus.ts
      skill/model/              → Skill.ts
      skill/factory/            → SkillFactory.ts
      */repositories/           → IExperienceRepository.ts, IProfileRepository.ts, etc.

  blog/                         → Stub (future)
  identity/                     → User, Role, IUserRepository
  contact/                      → Stub at core; application use case + infra email
```

---

## Aggregates (Current and Planned)

- **Profile** — main aggregate; owns `featuredProjectSlugs` (max 6)
- **Project** — aggregate root with slug, cover image, period, status, and localized fields
- **Experience** — aggregate root that owns `ExperienceSkill[]`, `DateRange`, logo, and description
- **BlogPost** (planned) — aggregate root; `Tag` as a VO inside Blog context

---

## Identity Context

**Responsibility:** back-office user, roles (`Role.ADMIN` | `Role.VISITOR`), and authorization rules expressed in use cases (`EnsureAdmin`, `GetCurrentUser`). Authentication with the provider (e.g. Supabase Auth) lives in **infra** and **middleware**; the domain receives identifiers already validated at the HTTP edge.

**Models in `packages/core`:**

| Class | Role | Description |
|-------|------|-------------|
| `User` | Aggregate root | `Name`, `Email`, `Role` |
| `Role` | Enum | `ADMIN` \| `VISITOR` |
| `IUserRepository` | Interface | `findById`, `findByEmail` |

**Application (`packages/application/identity`):** `GetCurrentUser`, `EnsureAdmin`.

**API:** see [05-API-CONTRACTS](./05-API-CONTRACTS.md) (`GET /api/v1/me`, future admin routes). **Rule:** the front-end does not call these use cases directly — HTTP only.

See [11-IDENTITY](./11-IDENTITY.md).

---

## See Also

- **[02-ARCHITECTURE](./02-ARCHITECTURE.md)** — Layer dependency rule and restrictions
- **[10-GLOSSARY](./10-GLOSSARY.md)** — Definition of every domain and architectural term
- **[packages/core/decisions/](../packages/core/decisions/)** — ADRs
