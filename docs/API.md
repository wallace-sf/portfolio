# REST API — Planned and Current

The project **does not yet have** a dedicated `apps/api` app or standalone REST server. This document describes the **planned API** for Projects, Blog, and Contact, and how it fits into the target architecture.

> This document primarily describes the **target API** of the monorepo. In the **current state**, behavior is still concentrated in `apps/web`, with part of the data coming from static sources and no dedicated `apps/api` package.

---

## Index

- [Overview](#overview)
- [Planned Endpoints](#planned-endpoints)
- [Response Format](#response-format)
- [Errors](#errors)
- [Authentication and CORS](#authentication-and-cors)
- [Future Implementation](#future-implementation)

---

## Overview

### Current State vs Target API

- **Current state**:
  - There is no dedicated `apps/api` package.
  - The repository does not yet expose a consolidated REST API for Portfolio and Blog.
  - Part of the read flow still happens directly in the web layer.
- **Target API**:
  - Endpoints for Projects, Blog, and Contact.
  - Use of `packages/application` and `packages/infra` as intermediate layers.
  - Consistent success / error envelope and explicit mapping of domain codes.

### Practical Rule

- When **designing new routes**, use this document as the target contract.
- When **reading current code**, assume REST implementation is still in transition.

- **Goal**: expose Projects and Blog (posts, tags) via REST to the frontend and possible future integrations.
- **Planned data source**: Supabase (Postgres) through `packages/infra`, with repositories behind Application ports.
- **Suggested stack**: Next.js Route Handlers (`app/api/...`) or a dedicated app (Node / Express / Fastify) in the monorepo. The final decision should happen during implementation.

---

## Planned Endpoints

### Projects

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/projects` | List projects (for example with `?locale=pt-BR` if localized content is supported) |
| `GET` | `/api/projects/:id` | Get project by ID (UUID) |

### Blog

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/posts` | List posts (for example with `?status=published`, `?tag=slug`, `?limit`, `?offset`) |
| `GET` | `/api/posts/:slug` | Get post by slug (published only) |
| `GET` | `/api/tags` | List tags |

### Contact (WIP)

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/contact` | Submit the contact form (`name`, `email`, `subject`, `message`) |

---

## Response Format

### Success (200)

- **List**: `{ "data": [...], "meta": { "total": number } }` (optional)
- **Single item**: `{ "data": { ... } }`

### Example — `GET /api/projects`

```json
{
  "data": [
    {
      "id": "uuid",
      "title": "string",
      "caption": "string",
      "content": "string",
      "skills": [
        { "id": "uuid", "description": "string", "icon": "string", "type": "TECHNOLOGY" }
      ]
    }
  ]
}
```

### Example — `GET /api/posts/:slug`

```json
{
  "data": {
    "id": "uuid",
    "slug": "string",
    "title": "string",
    "body": "string",
    "publishedAt": "ISO8601",
    "tags": [{ "slug": "string", "name": "string" }]
  }
}
```

---

## Errors

- **Envelope**: `{ "error": { "code": "string", "message": "string" } }`
- **Codes**: stable (for example, `ERROR_INVALID_ID`, `NOT_FOUND`); `message` translated according to `Accept-Language` or `?locale`.
- **HTTP**: `400` (validation), `404` (missing resource), `500` (internal error).

See [ERROR_HANDLING.md](ERROR_HANDLING.md) for Core error codes and edge mapping.

---

## Authentication and CORS

- **Projects and Blog (read-only)**: public; Supabase may use RLS or anonymous read according to project policy.
- **Contact (POST)**: evaluate rate limiting and, if needed, token / CAPTCHA; final decision belongs to implementation.
- **CORS**: allow the frontend origin (same domain or production / staging URLs).

---

## Future Implementation

1. **`packages/infra`**: Supabase repositories and mappers for Project, BlogPost, and Tag.
2. **`packages/application`** (or equivalent): use cases such as `GetProjects`, `GetProjectById`, `ListPosts`, `GetPostBySlug`, `ListTags`; port `IContactSender` for Contact.
3. **Routes**: either `apps/web/app/api/...` (Route Handlers) or a future `apps/api` app that calls Application.
4. **Contact delivery**: integration with Supabase (`contacts` table), Resend, or another provider behind `IContactSender`.

When `apps/api` is created, this document should either be migrated there or referenced from `apps/api/README.md`.
