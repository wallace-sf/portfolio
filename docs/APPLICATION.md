# Application — Use Cases, Ports, and View Models

**Status: WIP** — the `packages/application` package **does not exist yet**. This document describes how the application layer should be organized and how it integrates with Core and Infra.

> This document represents the **target architecture** of the application layer. The package does not yet exist in the current codebase, but it should be treated as the main direction for new architectural decisions.

---

## Index

- [Goal](#goal)
- [Ports](#ports)
- [Use Cases](#use-cases)
- [View Models](#view-models)
- [Planned Structure](#planned-structure)
- [Read Flow](#read-flow)

---

## Goal

### Current State vs Target Layer

- **Current state**:
  - `packages/application` has not been created yet.
  - Part of the orchestration still happens outside a formal application layer.
  - Some reads and integrations remain coupled to the web layer or static data.
- **Target layer**:
  - explicit use cases
  - ports separated from the domain and infrastructure
  - view models / DTOs for delivery layers
  - isolation between web / API and concrete repositories

### Practical Rule

- When **designing new code**, follow this structure as the reference.
- When **working in the current codebase**, treat this document as a convergence blueprint, not as a literal description of what already exists.

- **Orchestrate** the domain: use cases call repositories (ports) and return data ready for the interface (web / API).
- **Keep the Core pure**: Application depends on Core and defines **interfaces** (ports); Infra **implements** those ports.
- **View models**: DTOs or projections consumed by Web / API without exposing internal entities when that is undesirable.

---

## Ports

Interfaces implemented by Infra:

| Port | Planned methods | Usage |
|------|-----------------|-------|
| **`IProjectRepository`** | `findAll()`, `findById(id)` | Projects |
| **`IPostRepository`** | `findPublished(opts)`, `findBySlug(slug)` | Blog |
| **`ITagRepository`** | `findAll()` | Tags |
| **`IContactSender`** | `send(payload)` | Contact flow (WIP) |

Application **depends** on these interfaces (Dependency Inversion). The edge instantiates and injects concrete implementations through Route Handlers, `apps/api`, or a DI container if one is introduced.

---

## Use Cases

| Use case | Port(s) | Input | Output |
|----------|---------|-------|--------|
| **GetProjects** | `IProjectRepository` | — | `Project[]` or `ProjectViewModel[]` |
| **GetProjectById** | `IProjectRepository` | `id: string` | `Project` or `ProjectViewModel \| null` |
| **ListPosts** | `IPostRepository` | `{ limit?, offset?, tag? }` | `PostViewModel[]`, `meta` |
| **GetPostBySlug** | `IPostRepository` | `slug: string` | `PostViewModel \| null` |
| **ListTags** | `ITagRepository` | — | `TagViewModel[]` |
| **SendContact** (WIP) | `IContactSender` | `{ name, email, subject, message }` | `{ ok }` or error |

Use cases **do not** know Supabase or HTTP details. Domain errors are propagated explicitly and mapped to HTTP at the edge.

---

## View Models

Simple structures for Web / API, for example:

- **`ProjectViewModel`**: `id`, `title`, `caption`, `content`, `skills` (array of `{ id, description, icon, type }`). It may mirror `IProjectProps` or be a dedicated projection.
- **`PostViewModel`**: `id`, `slug`, `title`, `body`, `publishedAt`, `tags`.
- **`TagViewModel`**: `slug`, `name`.

When a Core entity is already serializable and sufficient, the use case may return it directly. When projections are needed (for example, summary listings or extra fields), prefer an explicit view model.

---

## Planned Structure

```text
packages/application/
├── src/
│   ├── ports/
│   │   ├── IProjectRepository.ts
│   │   ├── IPostRepository.ts
│   │   ├── ITagRepository.ts
│   │   └── IContactSender.ts
│   ├── use-cases/
│   │   ├── GetProjects.ts
│   │   ├── GetProjectById.ts
│   │   ├── ListPosts.ts
│   │   ├── GetPostBySlug.ts
│   │   ├── ListTags.ts
│   │   └── SendContact.ts
│   ├── view-models/
│   │   ├── ProjectViewModel.ts
│   │   ├── PostViewModel.ts
│   │   └── TagViewModel.ts
│   └── index.ts
├── package.json
└── README.md
```

- **Dependencies**: only `@repo/core` (and utility types from `@repo/utils` if needed). It must **not** depend on `packages/infra` or `apps/web` / `apps/api`.

---

## Read Flow

Example: **list projects**.

1. **Web / API** (Route Handler or controller) calls `GetProjects.execute()`.
2. **GetProjects** uses `IProjectRepository.findAll()`.
3. **Infra** reads Supabase rows and maps them to `Project[]` or `IProjectProps`.
4. **GetProjects** returns `Project[]` or `ProjectViewModel[]`.
5. **Web / API** serializes JSON and applies HTTP status mapping; if a domain error occurs, it maps code → status and localized message. See [ERROR_HANDLING.md](ERROR_HANDLING.md).

When `packages/application` is created, a package-level `README.md` can summarize these concepts and point back to this document.
