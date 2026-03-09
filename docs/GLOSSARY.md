# Glossary — Ubiquitous Language

This document defines the terms used in the codebase, documentation, and conversations about this project. Keeping language consistent across code, issues, and discussions is a core DDD practice.

> When in doubt about a term, refer here first.
> Some terms below describe the **target domain model** and may still be only partially implemented in the current codebase.

---

## Domain Terms

### Profile

The single professional identity of the portfolio owner. It contains the personal information shown in the hero section and sidebar: name, headline, bio, photo, stats, and social links. There is always exactly one `Profile`.

**Status:** target model, not fully implemented yet.

### Project

A piece of work the owner wants to showcase. It has a title, description, rich Markdown content, cover image, the skills used, and a publication status. Projects may be featured (shown on the Home page) or non-featured (shown only on the Portfolio page).

**Status:** partially implemented; the current codebase has a simpler version and is evolving toward this model.

### Experience

A professional role held at a company. It contains the company name, logo, position, employment type, location, period, and a list of skills used in that role, each with a contextual description of how the skill was applied.

**Status:** partially implemented; contextual skill usage is part of the target model.

### Skill

A technology, tool, methodology, or soft skill. It has a name, icon, and type. Skills are reusable across projects and experiences. Examples: React, TypeScript, DDD, Agile.

**Skill types:**

- `TECHNOLOGY` — programming language, framework, or tool
- `METHODOLOGY` — process or practice
- `SOFT_SKILL` — interpersonal or professional capability

### ExperienceSkill

The association between a `Skill` and an `Experience`, enriched with a contextual work description. The same skill (for example, TypeScript) may have different work descriptions in different experiences. `ExperienceSkill` is a Value Object, not an Entity.

**Status:** target model.

### Post _(post-MVP)_

A blog article written by the portfolio owner. It has a title, slug, Markdown content, tags, and a publication date.

### Tag _(post-MVP)_

A label used to categorize blog posts. It belongs to the Blog context.

### Message

A contact form submission sent by a visitor. It contains name, email, and message body. It may trigger an email notification to the portfolio owner.

**Status:** target / backlog model for the Contact context.

---

## Architectural Terms

### Bounded Context

A clearly defined boundary within which a particular domain model applies. This project has three: **Portfolio**, **Blog**, and **Contact**. Models from different contexts do not mix directly; only the Shared Kernel is shared.

### Shared Kernel

A small set of concepts shared across bounded contexts without belonging exclusively to any one of them. In this project, the **target model** includes concepts such as `Slug`, `DateRange`, `LocalizedText`, `Image`, `Markdown`, and `Tag`, while the **current implementation** already includes shared primitives such as `Id`, `Text`, `DateTime`, `Name`, `Url`, and enum-like VOs.

### Entity

A domain object with a unique identity that persists over time. Two entities with the same identity are considered the same object even if their attributes differ. Examples: `Project`, `Experience`, `Profile`.

### Value Object (VO)

An immutable domain object defined entirely by its attributes. Two Value Objects with the same attributes are equal. Value Objects have no identity. Examples: `Slug`, `DateRange`, `LocalizedText`, `ExperienceSkill`.

### Aggregate

An Entity that acts as the consistency boundary for a cluster of related objects. External code should only interact with the cluster through the aggregate root. In this project, `Profile` is an Aggregate that enforces the rule of at most 6 featured projects.

**Status:** target architecture reference.

### Repository

An interface that abstracts persistence for a given Aggregate or Entity. It is defined in the domain layer and implemented in the infrastructure layer. Examples: `IProjectRepository`, `IExperienceRepository`.

### Use Case

A single, explicitly named user action or system behavior. It lives in the application layer and orchestrates domain objects to fulfill a request. Examples: `GetProjectBySlug`, `SendContactMessage`.

### DTO (Data Transfer Object)

A plain serializable object that carries data between the application layer and delivery layers (web, API). DTOs contain no domain logic. They are the output contract of use cases.

### Port

An interface defined in the application layer that represents a dependency on an external service (for example, email). Infrastructure provides the concrete implementation.

### Either

A type that represents a value that can be either a failure (`Left`) or a success (`Right`). It is used throughout the domain and application layers to make error handling explicit at the type level, avoiding exceptions for expected business-rule failures.

---

## Status Terms (used in `Project`)

| Status | Meaning |
|--------|---------|
| `DRAFT` | Work in progress, not visible to visitors |
| `PUBLISHED` | Visible on the portfolio |
| `ARCHIVED` | Previously published, now hidden |

**Status:** target model for `ProjectStatus`.

---

## Locales

| Code | Language |
|------|----------|
| `pt-BR` | Brazilian Portuguese (required for all content) |
| `en-US` | English (optional, falls back to `pt-BR`) |
| `es` | Spanish (optional, falls back to `pt-BR`) |
