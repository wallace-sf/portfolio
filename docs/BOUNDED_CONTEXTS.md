# Bounded Contexts — Context Map and Responsibilities

Overview of the portfolio bounded contexts, their responsibilities, models, and integrations.

> This document describes both the **current state** and the **target model**. When a concept is not yet implemented in code, treat it as part of the target architecture.

---

## Context Map (Summary)

| Context | Main responsibility | Key models | Integrations |
|---------|---------------------|------------|--------------|
| **Portfolio** | Projects, experience, skills, profile, professional values | Project, Experience, Skill, ProfessionalValue, Language, SocialNetwork | Shared Kernel; future REST API |
| **Blog** | Posts, tags, publication, listing | BlogPost, Tag | Shared Kernel; Supabase; REST API (WIP) |
| **Contact** | Contact message capture and delivery | DTOs, form payload | Web form; backend / newsletter WIP |
| **Shared Kernel** | Id, Text, DateTime, Entity, ValueObject, error codes, enums | Id, Text, DateTime, Name, Url, EmploymentType, LocationType, SkillType, Fluency, ERROR_MESSAGE | Used by Portfolio and Blog (and Contact where it makes sense) |

---

## Portfolio

- **Responsibility**: represent case studies, professional experience, skills, values, and profile information such as languages and social links.
- **Models in the current state** (in `@repo/core`):
  - `Project` — title, caption, content, skills
  - `Experience` — company, role, period, location, employment type, skills
  - `Skill` — description, icon, type (`TECHNOLOGY`, etc.)
  - `ProfessionalValue`, `Language`, `SocialNetwork`
- **Target model**:
  - `Profile` as the main aggregate
  - `Project` with slug, cover image, status, related projects, and localized content
  - `Experience` with `ExperienceSkill`, `DateRange`, logo, and description
  - new VOs such as `Slug`, `Image`, `DateRange`, `ProfileStat`
- **VOs and typed enums**: `Text`, `DateTime`, `EmploymentType`, `LocationType`, `SkillType`, `Fluency`, `Id`, `Name`, `Url`
- **Integrations**: consumed by the web today; later by the API as well. Data is still partly static; persistence through Supabase (Infra) is planned.

---

## Blog

- **Responsibility**: blog posts, tags, and publication states such as draft and published.
- **Models in the target architecture**:
  - `BlogPost` — title, slug, body, date, tags, status
  - `Tag` — name, slug (as a VO or entity)
- **Integrations**: Supabase tables such as `posts` and `tags`; REST API for listing and retrieving posts by slug. Shared Kernel for `Id`, `DateTime`, `Text`, and errors.

---

## Contact

- **Responsibility**: receive contact form submissions and, in the future, deliver them through email, an external service, or Supabase.
- **Current state**: DTO / payload-oriented flow implemented at the edge.
- **Target model**: `Message` entity or a dedicated application / infra flow with explicit rules and later persistence / delivery integration.
- **Integrations**: Web (currently Formik + Yup in some areas); backend / newsletter WIP.

---

## Shared Kernel

- **What belongs here**:
  - `Entity`, `ValueObject`, `IEntityProps`
  - `Id`, `Text`, `DateTime`, `Name`, `Url`
  - `EmploymentType`, `LocationType`, `SkillType`, `Fluency`
  - `ERROR_MESSAGE` (domain error codes; `pt-BR`, `en-US`; `es` planned)
- **What does not belong here**: rules specific to a single context (for example, “a post can only be published with at least one tag” belongs to Blog, not Shared Kernel).
- **Where it lives today**: `@repo/core` (`shared/` and shared VOs).

> In the current state, the shared kernel is not yet fully separated under `shared-kernel/`. The codebase is expected to migrate incrementally in that direction.

---

## Relationship Diagram (ASCII)

```text
                    ┌──────────────────┐
                    │  Shared Kernel   │
                    │  Id, Text, VO,   │
                    │  Entity, Errors  │
                    └────────┬─────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
         ▼                   ▼                   ▼
┌────────────────┐  ┌────────────────┐  ┌────────────────┐
│   Portfolio    │  │      Blog      │  │    Contact     │
│  Project       │  │   BlogPost     │  │  (DTOs/forms)  │
│  Experience    │  │   Tag          │  │                │
│  Skill, etc.   │  │                │  │                │
└───────┬────────┘  └───────┬────────┘  └───────┬────────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            │
                    ┌───────▼───────┐
                    │    Web / API  │
                    └───────────────┘
```

---

## Integration Conventions

- **Portfolio ↔ Web**: DTOs or view models; the domain should not expose “raw” entities when a projection is needed (for example, summarized listing cards).
- **Blog ↔ Supabase**: repositories in `packages/infra`; mappers convert rows into Core entities / VOs.
- **Contact ↔ Backend**: WIP; API contract (payload and error codes) must align with [ERROR_HANDLING.md](ERROR_HANDLING.md) and [API.md](API.md).

## Practical Rule

- If the goal is to **understand the current codebase**, read the blocks marked as current state.
- If the goal is to **design new code**, use the target model as the main direction.
