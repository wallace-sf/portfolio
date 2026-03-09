# Glossary — Ubiquitous Language

This document defines the terms used throughout the codebase, documentation, and conversations about this project. Using consistent language across code, issues, and discussions is a core DDD practice.

> When in doubt about a term, refer here first.

---

## Domain Terms

### Profile

The single professional identity of the portfolio owner. Contains personal information displayed in the hero section and sidebar: name, headline, bio, photo, stats, and social links. There is always exactly one Profile.

### Project

A piece of work the owner wants to showcase. Has a title, description, rich Markdown content, cover image, skills used, and a publication status. Projects can be featured (shown on the Home page) or non-featured (shown only in the Portfolio page).

### Experience

A professional role held at a company. Contains the company name, logo, position, employment type, location, period, and a list of skills used during that role — each with a contextual description of how that skill was applied.

### Skill

A technology, tool, methodology, or soft skill. Has a name, icon, and type. Skills are reusable across projects and experiences. Examples: React, TypeScript, DDD, Agile.

**Skill types:**

- `TECHNOLOGY` — a programming language, framework, or tool (e.g. React, Node.js, PostgreSQL)
- `METHODOLOGY` — a process or practice (e.g. Scrum, TDD, DDD)
- `SOFT_SKILL` — a interpersonal or professional capability (e.g. Technical Leadership)

### ExperienceSkill

The association between a Skill and an Experience, enriched with a contextual work description. The same Skill (e.g. TypeScript) may have different work descriptions in different experiences. ExperienceSkill is a Value Object, not an Entity.

### Post _(post-MVP)_

A blog article written by the portfolio owner. Has a title, slug, content (Markdown), tags, and a publication date.

### Tag _(post-MVP)_

A label used to categorize blog posts. Belongs to the Blog context.

### Message

A contact form submission sent by a visitor. Contains name, email, and message body. Triggers an email notification to the portfolio owner.

---

## Architectural Terms

### Bounded Context

A clearly defined boundary within which a particular domain model applies. This project has three: **Portfolio**, **Blog**, and **Contact**. Models from different contexts do not mix — only the Shared Kernel is shared.

### Shared Kernel

A small set of concepts shared across bounded contexts without belonging to any single one. In this project: `Slug`, `DateRange`, `LocalizedText`, `Image`, `Markdown`, `Tag`.

### Entity

A domain object with a unique identity that persists over time. Two entities with the same identity are considered the same object, even if their attributes differ. Examples: `Project`, `Experience`, `Profile`.

### Value Object (VO)

An immutable domain object defined entirely by its attributes. Two Value Objects with the same attributes are equal. Value Objects have no identity. Examples: `Slug`, `DateRange`, `LocalizedText`, `ExperienceSkill`.

### Aggregate

An Entity that acts as the consistency boundary for a cluster of related objects. External code may only interact with the cluster through the Aggregate root. In this project, `Profile` is an Aggregate that enforces the rule of a maximum of 6 featured projects.

### Repository

An interface that abstracts data persistence for a given Aggregate or Entity. Defined in the domain layer, implemented in the infrastructure layer. Examples: `IProjectRepository`, `IExperienceRepository`.

### Use Case

A single, named user action or system behavior. Lives in the application layer and orchestrates domain objects to fulfill a request. Examples: `GetProjectBySlug`, `SendContactMessage`.

### DTO (Data Transfer Object)

A plain, serializable object that carries data between the application layer and delivery layers (web, API). DTOs contain no domain logic. They are the output contract of use cases.

### Port

An interface defined in the application layer that represents a dependency on an external service (e.g. email). Infrastructure provides the concrete implementation.

### Either

A type that represents a value that can be one of two things: a failure (`Left`) or a success (`Right`). Used throughout the domain and application layers to make error handling explicit at the type level, avoiding exceptions for expected business rule violations.

---

## Status Terms (used in Project)

| Status      | Meaning                                   |
| ----------- | ----------------------------------------- |
| `DRAFT`     | Work in progress, not visible to visitors |
| `PUBLISHED` | Visible on the portfolio                  |
| `ARCHIVED`  | Previously published, now hidden          |

---

## Locales

| Code    | Language                                        |
| ------- | ----------------------------------------------- |
| `pt-BR` | Brazilian Portuguese (required for all content) |
| `en-US` | English (optional, falls back to pt-BR)         |
| `es`    | Spanish (optional, falls back to pt-BR)         |
