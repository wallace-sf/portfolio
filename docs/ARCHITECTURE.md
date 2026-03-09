# Architecture — DDD and Clean Architecture

This document describes how **Clean Architecture** and **DDD** are applied in the portfolio: layers, dependencies, bounded contexts, and key decisions.

> This document mixes **current state** and **target architecture**. When they differ, treat the target architecture as the official direction for new code and the current state as migration context.

---

## Index

- [Applied Clean Architecture](#applied-clean-architecture)
- [DDD in the Project](#ddd-in-the-project)
- [MVP Read Path](#mvp-read-path)
- [Key Decisions](#key-decisions)

---

## Applied Clean Architecture

### Current State vs Target Architecture

- **Current state**:
  - `packages/core` exists and already concentrates the implemented domain.
  - `packages/application` and `packages/infra` do not yet exist as real packages.
  - Part of the read flow still happens with static data or directly in the web layer.
  - The internal structure of the Core still contains legacy modules such as `project/model/Project.ts`, `experience/Experience.ts`, and `skill/factory/SkillFactory.ts`.
- **Target architecture**:
  - `core ← application ← infra ← web/api`
  - `packages/application` orchestrates use cases and ports.
  - `packages/infra` implements repositories and adapters.
  - `packages/core` converges toward organization by bounded context, especially `portfolio/entities/...`, `shared-kernel/...`, and repositories defined in the domain.

### Practical Rule

- For **documentation and design**, use the target architecture as the reference.
- For **local changes in existing code**, consider the current state and migrate incrementally.

### Dependency Rule

- **Core (domain)** does not depend on infra, web, or API.
- **Application** (use cases, ports) depends only on Core.
- **Infra** implements the ports defined by Application.
- **Web** and **API** consume Application, or call use cases directly while Application is still being introduced.

```text
     Web / API
          │
          ▼
   Application (use cases, ports)  ◄─── WIP
          │
          ▼
       Core (domain)
          ▲
          │
      Infra (adapters, repos)  ◄─── WIP
```

### Layers

| Layer | Package / location | Responsibility |
|-------|--------------------|----------------|
| **Domain** | `@repo/core` | Entities, Value Objects, invariants, aggregates, shared kernel. No framework or persistence dependency. |
| **Application** | `packages/application` or `docs/APPLICATION.md` (WIP) | Use cases, ports, and view models. Orchestrates the domain. |
| **Infra** | `packages/infra` (WIP) | Repository implementations, database mappers, and external clients. |
| **Interface** | `apps/web`, `apps/api` (future) | HTTP, routes, forms, UI i18n. Calls Application or use cases. |

### Core Does Not Depend On External Frameworks

- `@repo/core` currently imports only `@repo/utils` (for `Validator`, `ValidationError`) and `uuid`.
- There are no imports from Next.js, Supabase, React, or HTTP clients inside the domain layer.
- Domain errors use **stable codes** (for example, `ERROR_INVALID_ID`, `ERROR_INVALID_TEXT`); translation and HTTP mapping happen at the edge. See [ERROR_HANDLING.md](ERROR_HANDLING.md).

---

## DDD in the Project

### Shared Kernel

Shared elements across bounded contexts in `@repo/core`:

- **Base**: `Entity`, `ValueObject`, `IEntityProps`
- **Common VOs**: `Id`, `Text`, `DateTime`, `Url`, `Name`
- **Enums / typed VOs**: `EmploymentType`, `LocationType`, `SkillType`, `Fluency`
- **Domain error i18n**: `ERROR_MESSAGE` (`pt-BR`, `en-US`) with stable codes and translation handled at the edge

> In the current state, some of these elements live under `shared/`, `shared/vo/`, and `shared/i18n/`. In the target architecture, part of them will converge into a more explicit shared kernel.

### Bounded Contexts

| Context | Responsibility | Main models | Status |
|---------|----------------|-------------|--------|
| **Portfolio** | Projects, experiences, skills, profile, values | `Project`, `Experience`, `Skill`, `ProfessionalValue`, `Language`, `SocialNetwork` | Implemented in Core |
| **Blog** | Posts, tags, publication | `BlogPost`, `Tag` (to be defined in Core) | WIP |
| **Contact** | Contact form and message delivery | DTOs / form flow | Partial (frontend only; backend WIP) |

Details: [BOUNDED_CONTEXTS.md](BOUNDED_CONTEXTS.md).

### Aggregates (Current and Planned)

- **Current state**:
  - `Project`, `Experience`, `Skill`, `ProfessionalValue`, `Language`, and `SocialNetwork` already exist in Core.
  - `Project` and `Experience` already compose `Skill[]`.
- **Target architecture**:
  - **Project** — aggregate root with slug, cover image, period, status, and localized fields.
  - **Experience** — aggregate root that evolves to include `ExperienceSkill`, `DateRange`, logo, and description.
  - **Profile** — main aggregate of the portfolio, enforcing a maximum of 6 featured projects.
  - **BlogPost** (WIP) — aggregate root; **Tag** as a Value Object or entity inside the Blog context.

---

## MVP Read Path

Read flow example (for example, listing projects) when Application and Infra are in place:

```text
Web (page/route)
    │
    ▼
Use case (for example, GetProjects)
    │
    ▼
Port (for example, IProjectRepository)
    │
    ▼
Infra (ProjectRepositorySupabase)
    │  └─ mapper: DB row → IProjectProps / Project
    ▼
Domain (Project, Skill, ...)
    │
    ▼
ViewModel (DTO or serializable domain projection)
    │
    ▼
UI (components, next-intl for UI)
```

Today, part of the content (for example, projects) still comes from static data directly in the page. The flow above is the target for database-backed content.

---

## Key Decisions

### Database Content via Supabase in the MVP

- **Decision**: Use Supabase (and `supabase-js`) for Blog first, and then for Projects and other dynamic data.
- **Reason**: Accelerate the MVP with Auth, Realtime, and Postgres without running custom infrastructure. Infra will abstract Supabase behind ports.

### i18n: UI and Domain

- **UI**: `next-intl`; messages live in `apps/web/messages/{pt-BR,en-US,es}.json`.
- **Domain**: error codes live in the Core (`ERROR_MESSAGE`); translated messages are resolved at the edge based on request locale.
- **Domain content** (for example, project descriptions in multiple languages): a strategy based on `LocalizedText` or locale-specific columns is still being defined. See [I18N.md](I18N.md).

### Errors: Codes in the Core, Translation at the Edge

- The domain throws `ValidationError` (or equivalent) with a stable **code** (for example, `ERROR_INVALID_ID`).
- The Core maintains `ERROR_MESSAGE` (or a code-to-i18n-key map) for `pt-BR` and `en-US`; `es` is still to be added.
- Web / API map domain code → HTTP status and code → localized message. See [ERROR_HANDLING.md](ERROR_HANDLING.md).

### Validation: Zod at the Edge, Invariants in the Domain

- **Edge (forms, API, row decoding)**: Zod (or equivalent) for input, query, body, and row decoding.
- **Domain**: invariants enforced in constructors and methods (for example, `Experience: start_at <= end_at`); current violations still throw `ValidationError` with a stable code.
- **Migration**: `Validator` in `@repo/utils` is still used in the domain today; new edge code should converge to Zod. See [VALIDATION.md](VALIDATION.md).
