# 10 — Glossary

> Ubiquitous language for the codebase. When in doubt about a term, refer here first.

---

## Domain Terms — Portfolio Context

### Profile

The single professional identity of the portfolio owner. Contains name, headline, bio, photo, stats, social links, and featured project references. There is always exactly one `Profile`.

- **Aggregate root**: owns `featuredProjectSlugs` (max 6)
- **Key invariant**: `featuredProjectSlugs.length <= 6`
- TypeScript: `Profile` in `src/portfolio/entities/profile/model/Profile.ts`

### Project

A piece of work the owner wants to showcase. Has a title, description, rich Markdown content, cover image, skills used, publication status, and optional related projects.

- **Aggregate root**: owns `skills` (via `SkillFactory`) and enforces status transitions
- **Status lifecycle**: `DRAFT → PUBLISHED → ARCHIVED`
- TypeScript: `Project` in `src/portfolio/entities/project/model/Project.ts`

### Experience

A professional role held at a company. Contains company name, logo, position, employment type, location type, period, and a list of skills used with contextual descriptions.

- **Aggregate root**: owns `ExperienceSkill[]` and `DateRange`
- **Key invariant**: `start_at <= end_at` when `end_at` is present (delegated to `DateRange`)
- TypeScript: `Experience` in `src/portfolio/entities/experience/model/Experience.ts`

### Skill

A technical or professional capability (e.g., TypeScript, React, System Design). Has a name, icon, and type.

- **Entity**: identified by `Id`
- **Skill types**: `hard` (technical), `soft` (interpersonal), `language` (spoken/written)
- TypeScript: `Skill` in `src/portfolio/entities/skill/model/Skill.ts`

### ExperienceSkill

The association between a `Skill` and an `Experience`, enriched with a localized description of the work performed using that skill.

- **Value Object**: `Skill` entity + `LocalizedText` (workDescription)
- TypeScript: `ExperienceSkill` in `src/portfolio/entities/experience/model/ExperienceSkill.ts`

### Language

A spoken/written language the author is proficient in (e.g., Portuguese, English).

- **Entity**: identified by `Id`, carries a `Fluency` level
- TypeScript: `Language` in `src/portfolio/entities/language/model/Language.ts`

### SocialNetwork

A social media or professional network profile link (e.g., GitHub, LinkedIn).

- **Entity**: identified by `Id`
- TypeScript: `SocialNetwork` in `src/portfolio/entities/social-network/model/SocialNetwork.ts`

### ProfessionalValue

A personal professional principle the author holds (e.g., Clean Code, Ownership).

- **Entity**: identified by `Id`
- TypeScript: `ProfessionalValue` in `src/portfolio/entities/professional-value/model/ProfessionalValue.ts`

### ProfileStat

A metric displayed on the profile (e.g., "5 years of experience").

- **Value Object**: `LocalizedText` (label) + `string` (value) + `Text` (icon)
- TypeScript: `ProfileStat` in `src/portfolio/entities/profile/model/ProfileStat.ts`

### ProjectStatus

The publication lifecycle state of a Project.

| Value | Meaning |
|-------|---------|
| `DRAFT` | Work in progress, not publicly visible |
| `PUBLISHED` | Publicly visible on the portfolio |
| `ARCHIVED` | No longer active |

### Post _(post-MVP)_

A blog article. Has title, slug, Markdown content, tags, and a publication date.

### Message

A contact form submission. Contains name, email, and message body.

---

## Domain Terms — Identity Context

### User

Aggregate root em `@repo/core/identity`. Identificador (`Id`), `Name`, `Email`, `Role`. Métodos `isAdmin()` / `isVisitor()`. O vínculo com o IdP será tipicamente uma coluna **`authSubject`** (UUID estável, ex. `sub` do Supabase) na persistência — **planeado**; senhas ficam só no IdP.

### authSubject

Identificador externo do utilizador no provedor de auth (ex. id em `auth.users`). Liga a sessão ao registo `User` da aplicação; ver [11-IDENTITY](./11-IDENTITY.md).

### IAuthenticationGateway (application port)

Contrato para ler sessão, sign-in, sign-out e refresh **sem** expor Supabase à application ou ao front. Implementação concreta na infra; ver [11-IDENTITY](./11-IDENTITY.md).

### Role

Enum (`ADMIN` | `VISITOR`). `ADMIN` desbloqueia operações de gestão quando a API e os casos de uso (`EnsureAdmin`) o exigem.

### EnsureAdmin (application use case)

Caso de uso que verifica se o utilizador existe e é `ADMIN`; caso contrário devolve `UnauthorizedError`. Substitui um objeto `AccessPolicy` separado enquanto as regras forem binárias.

### UnauthorizedError

Erro de domínio (`code` `UNAUTHORIZED`) para falhas de autorização (ex.: utilizador autenticado sem privilégio de admin). Na API, mapeia tipicamente a HTTP **401** (ver [05-API-CONTRACTS](./05-API-CONTRACTS.md)).

---

## Domain Terms — Shared Kernel Value Objects

### Either

A type representing a value that can be either a failure (`Left`) or a success (`Right`). Used throughout the domain to make error handling explicit, avoiding exceptions for business-rule failures.

```typescript
const result: Either<ValidationError, Slug> = Slug.create('my-project');
if (result.isLeft())  { /* error: result.value is ValidationError */ }
if (result.isRight()) { /* success: result.value is Slug */ }
```

### Slug

A URL-friendly identifier in kebab-case (e.g., `my-project`).

- Format: `/^[a-z0-9]+(?:-[a-z0-9]+)*$/`, min 3 chars
- TypeScript: `Slug` in `src/shared/vo/Slug.ts`

### DateRange

A time period with a required start date and optional end date.

- `isActive()` → `true` when `endAt` is absent (ongoing)
- Invariant: `endAt >= startAt` when `endAt` is present
- TypeScript: `DateRange` in `src/shared/vo/DateRange.ts`

### LocalizedText

Multi-language text content keyed by locale.

- `pt-BR` is required and must be non-empty; `en-US` and `es` are optional
- `get(locale, fallback?)` resolves text with fallback chain
- TypeScript: `LocalizedText` in `src/shared/i18n/LocalizedText.ts`

### Image

A visual asset with a validated URL and localized alt text.

- Composed of `Url` + `LocalizedText` (for alt)
- TypeScript: `Image` in `src/shared/vo/Image.ts`

### Id

A UUID-based entity identifier.

- `Id.generate()` — creates a new UUID (always succeeds)
- `Id.create(value)` — validates existing UUID, returns `Either<ValidationError, Id>`
- TypeScript: `Id` in `src/shared/vo/Id.ts`

### DateTime

A parsed and validated ISO date/time wrapper.

- TypeScript: `DateTime` in `src/shared/vo/DateTime.ts`

### Text

A generic string value with configurable min/max length constraints.

- TypeScript: `Text` in `src/shared/vo/Text.ts`

### Name

A person or entity name with stricter constraints than `Text` (3–100 chars, alpha characters).

- TypeScript: `Name` in `src/shared/vo/Name.ts`

### Url

A validated URL string.

- TypeScript: `Url` in `src/shared/vo/Url.ts`

### EmploymentType

The employment arrangement for an experience entry.

| Value | Meaning |
|-------|---------|
| `full-time` | Full-time position |
| `part-time` | Reduced hours |
| `freelance` | Contract / freelance |
| `internship` | Internship / trainee |

### LocationType

The working modality for an experience entry.

| Value | Meaning |
|-------|---------|
| `on-site` | Fully on-site |
| `remote` | Fully remote |
| `hybrid` | Mixed on-site and remote |

### SkillType

The category of a skill.

| Value | Meaning |
|-------|---------|
| `hard` | Technical (e.g., TypeScript, Postgres) |
| `soft` | Interpersonal (e.g., communication) |
| `language` | Spoken/written language |

### Fluency

Proficiency level for a spoken/written language.

| Value | Meaning |
|-------|---------|
| `native` | Native speaker |
| `fluent` | Fluent (C1/C2) |
| `advanced` | Advanced (B2) |
| `intermediate` | Intermediate (B1) |
| `basic` | Basic (A1/A2) |

---

## Architectural Terms

### Bounded Context

A clearly defined boundary within which a particular domain model applies. This project has three: **Portfolio**, **Blog**, and **Contact**. Models from different contexts do not mix; only the Shared Kernel is shared.

### Shared Kernel

A small set of concepts shared across bounded contexts without belonging exclusively to any one of them. Includes `Slug`, `DateRange`, `LocalizedText`, `Image`, `Id`, `Text`, `DateTime`, and error infrastructure.

### Entity

A domain object with a unique identity that persists over time. Two entities with the same `Id` are the same object even if attributes differ. Examples: `Project`, `Experience`, `Profile`.

### Value Object (VO)

An immutable domain object defined entirely by its attributes. Two VOs with the same attributes are equal — no identity. Examples: `Slug`, `DateRange`, `LocalizedText`, `ExperienceSkill`.

### Aggregate

An Entity that acts as a consistency boundary for a cluster of related objects. External code interacts only through the aggregate root. Example: `Profile` enforces the max-6-featured-projects invariant.

### Repository

An interface that abstracts persistence for an Aggregate. Defined in the domain layer (`@repo/core`), implemented in infrastructure (`@repo/infra`). Examples: `IProjectRepository`, `IExperienceRepository`.

### Use Case

A single, explicitly named user action or system behavior. Lives in the application layer, orchestrates domain objects to fulfill a request. Examples: `GetProjectBySlug`, `SendContactMessage`.

### DTO (Data Transfer Object)

A plain serializable object carrying data between the application layer and delivery layers (web, API). Contains no domain logic.

### Port

An interface defined in the application layer representing a dependency on an external service. Infrastructure provides the concrete implementation. Examples: `IContactSender`, `IProjectRepository`.

---

## Error Hierarchy

```text
DomainError (abstract)
  └── ValidationError    — invariant violations, invalid input
  └── NotFoundError      — entity lookup failures
  └── UnauthorizedError  — auth/authorization failures (planejado)
```

All domain errors use a static `ERROR_CODE` constant in `SCREAMING_SNAKE_CASE` (e.g., `INVALID_SLUG`, `INVALID_DATE_RANGE`).

---

## Supported Locales

| Code | Language |
|------|----------|
| `pt-BR` | Brazilian Portuguese (required for all content) |
| `en-US` | English (optional; `defaultLocale` for UI) |
| `es` | Spanish (optional; falls back to `pt-BR`) |
