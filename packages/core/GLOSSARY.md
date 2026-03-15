# packages/core — Ubiquitous Language Glossary

This glossary defines the domain terms used across `packages/core`. All code — class names, method names, variable names — must align with these definitions.

---

## Entities & Aggregates (Portfolio Context)

### Project

A portfolio work item representing a commercial, personal, or academic project developed by the author.

- **Aggregate root**: owns `skills` (via `Slug[]`) and enforces status transitions
- **Key invariants**: slug uniqueness, status can only go `DRAFT → PUBLISHED → ARCHIVED`
- **TypeScript**: `Project` in `src/portfolio/entities/project/model/Project.ts`

```typescript
Project.create({
  title: { 'pt-BR': 'Meu Projeto', 'en-US': 'My Project' },
  slug: 'my-project',
  status: 'DRAFT',
  featured: false,
  // ...
})
```

---

### Experience

A professional work experience entry representing a position held at a company.

- **Aggregate root**: owns `skills` (as `ExperienceSkill[]`)
- **Key invariants**: `start_at` must be a valid date; `end_at` must be after `start_at` when present (delegated to `DateRange`)
- **TypeScript**: `Experience` in `src/portfolio/entities/experience/model/Experience.ts`

---

### Profile

The portfolio owner's personal data shown on the Home hero, stats section, and sidebar.

- **Aggregate root**: owns `featuredProjectSlugs` (max 6)
- **Key invariant**: `featuredProjectSlugs.length <= 6`
- **TypeScript**: `Profile` in `src/portfolio/entities/profile/model/Profile.ts`

---

### Skill

A technical or professional capability (e.g., TypeScript, React, System Design).

- **Entity** (not aggregate root): identified by `Id`, owned by experiences via `ExperienceSkill`
- **TypeScript**: `Skill` in `src/portfolio/entities/skill/model/Skill.ts`

---

### Language

A spoken/written language the author is proficient in (e.g., Portuguese, English).

- **Entity**: identified by `Id`, carries a `Fluency` level
- **TypeScript**: `Language` in `src/portfolio/entities/language/model/Language.ts`

---

### SocialNetwork

A social media or professional network profile link (e.g., GitHub, LinkedIn).

- **Entity**: identified by `Id`
- **TypeScript**: `SocialNetwork` in `src/portfolio/entities/social-network/model/SocialNetwork.ts`

---

### ProfessionalValue

A personal professional value or principle the author holds (e.g., Clean Code, Ownership).

- **Entity**: identified by `Id`
- **TypeScript**: `ProfessionalValue` in `src/portfolio/entities/professional-value/model/ProfessionalValue.ts`

---

## Value Objects (Shared Kernel)

### Either

Represents the result of an operation that may succeed (`Right`) or fail (`Left`). Used instead of `throw` for all domain errors.

```typescript
// Either<L, R> = Left<L, R> | Right<L, R>
const result: Either<ValidationError, Slug> = Slug.create('my-project');
if (result.isLeft())  // error path
if (result.isRight()) // success path
```

---

### Slug

A URL-friendly identifier in kebab-case format (e.g., `my-project`).

- **Format**: `/^[a-z0-9]+(?:-[a-z0-9]+)*$/`, min 3 characters
- **Usage**: unique identifier for `Project` in URLs
- **TypeScript**: `Slug` in `src/shared/vo/Slug.ts`

```typescript
Slug.create('my-project') // Right<Slug>
Slug.create('MY PROJECT') // Left<ValidationError> — spaces and uppercase rejected
```

---

### Image

Represents a visual asset with a validated URL and localized alt text.

- **Composed of**: `Url` + `LocalizedText` (for alt)
- **TypeScript**: `Image` in `src/shared/vo/Image.ts`

```typescript
Image.create('https://cdn.example.com/img.png', { 'pt-BR': 'Foto', 'en-US': 'Photo' })
```

---

### DateRange

A time period with a required start date and an optional end date.

- **`isActive()`**: returns `true` when `endAt` is absent (ongoing)
- **Invariant**: `endAt >= startAt` when `endAt` is present
- **TypeScript**: `DateRange` in `src/shared/vo/DateRange.ts`

---

### LocalizedText

Multi-language text content keyed by locale (e.g., `pt-BR`, `en-US`).

- **Type**: `Record<string, string>`
- **Invariant**: at least one locale key with non-empty value
- **TypeScript**: `LocalizedText` in `src/shared/i18n/LocalizedText.ts`

```typescript
LocalizedText.create({ 'pt-BR': 'Olá', 'en-US': 'Hello' })
```

---

### Id

A UUID-based entity identifier.

- **`Id.generate()`**: creates a new random UUID (no Either — always succeeds)
- **`Id.create(value)`**: validates an existing UUID string, returns `Either<ValidationError, Id>`
- **TypeScript**: `Id` in `src/shared/vo/Id.ts`

---

### DateTime

A parsed and validated date/time wrapper.

- **TypeScript**: `DateTime` in `src/shared/vo/DateTime.ts`

---

### Text

Generic string value with configurable min/max length.

- **TypeScript**: `Text` in `src/shared/vo/Text.ts`

---

### Name

Represents a person or entity name with stricter constraints than `Text`.

- **TypeScript**: `Name` in `src/shared/vo/Name.ts`

---

### Url

A validated URL string.

- **TypeScript**: `Url` in `src/shared/vo/Url.ts`

---

### EmploymentType

The employment arrangement for an experience entry.

| Value | Meaning |
|---|---|
| `full-time` | Dedicated full-time position |
| `part-time` | Reduced hours position |
| `freelance` | Contract / freelance engagement |
| `internship` | Internship / trainee |

---

### LocationType

The working modality for an experience entry.

| Value | Meaning |
|---|---|
| `on-site` | Fully on-site |
| `remote` | Fully remote |
| `hybrid` | Mixed on-site and remote |

---

### SkillType

The category of a skill.

| Value | Meaning |
|---|---|
| `hard` | Technical skill (e.g., TypeScript, Postgres) |
| `soft` | Interpersonal skill (e.g., communication) |
| `language` | Spoken/written language (e.g., English) |

---

### Fluency

Proficiency level for a spoken/written language.

| Value | Meaning |
|---|---|
| `native` | Native speaker |
| `fluent` | Fluent (C1/C2) |
| `advanced` | Advanced (B2) |
| `intermediate` | Intermediate (B1) |
| `basic` | Basic (A1/A2) |

---

## Value Objects (Portfolio Context)

### ExperienceSkill

Contextualizes a `Skill` within an `Experience`, adding a localized description of the work performed using that skill.

- **Composed of**: `Skill` entity + `LocalizedText` (workDescription)
- **TypeScript**: `ExperienceSkill` in `src/portfolio/entities/experience/model/ExperienceSkill.ts`

---

### ProfileStat

A metric displayed on the profile (e.g., "5 years of experience").

- **Composed of**: `LocalizedText` (label) + `string` (value) + `Text` (icon)
- **TypeScript**: `ProfileStat` in `src/portfolio/entities/profile/model/ProfileStat.ts`

---

### ProjectStatus

The publication lifecycle state of a `Project`.

| Value | Meaning |
|---|---|
| `DRAFT` | Work in progress, not publicly visible |
| `PUBLISHED` | Publicly visible on the portfolio |
| `ARCHIVED` | No longer active, may still be visible |

---

## Error Hierarchy

```
DomainError (abstract)
  └── ValidationError    — invariant violations, invalid input
  └── NotFoundError      — entity lookup failures
```

All domain errors use an `ERROR_CODE` constant in `SCREAMING_SNAKE_CASE` format (e.g., `INVALID_SLUG`, `INVALID_DATE_RANGE`).
