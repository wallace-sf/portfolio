# 11 — Identity

> Identity bounded context: users, roles, **authentication** (session) and **authorization** (admin). Complements [03-BOUNDED-CONTEXTS](./03-BOUNDED-CONTEXTS.md) and [05-API-CONTRACTS](./05-API-CONTRACTS.md).

---

## What "auth" means in this project

In DDD, **Identity** is its own **bounded context**: it models *who* the user is and *what* they can do in the system (via `Role` and use cases like `EnsureAdmin`). It is **not** just "middleware": the rule "only ADMIN can…" lives in the domain and application layers.

- **Authentication** (session, credentials): must be abstracted by a **port in the application layer** (`IAuthenticationGateway`), with an **implementation in infra** (e.g. Supabase). The **front-end** does not reference the vendor's SDK.
- **Authorization:** **`EnsureAdmin`**, **`GetCurrentUser`**, and future use cases — invoked only from a backend boundary (route handlers or a dedicated API), never from React components.

The **front-end** does not import **`@supabase/*`** or other IdP SDKs; `'use client'` components do not import `@repo/application`.

---

## Passwords and `authSubject` (target model)

- **The project does not store passwords** in the application table (`User` in Prisma). Credentials live at the **auth provider** (e.g. `auth.users` in Supabase).
- In your database you store profile and roles, plus a stable column linking to the auth account — for example **`authSubject`** (UUID equal to the user's id in Supabase Auth / `sub` claim of the JWT).
- Mental model: `auth.users` (IdP) ↔ `User` (Prisma) via `authSubject`; email and name may exist on both sides, but the **password** stays only at the IdP.

---

## Pluggable provider (Clean Architecture)

| Layer | What it may know about Supabase (or another IdP) |
|-------|--------------------------------------------------|
| **`apps/site` (UI, `middleware.ts`)** | **Nothing.** No IdP SDK. `'use client'` components do not import `@repo/application`. |
| **Future backend / route handlers** | Do **not** import `@supabase/*` directly. Use `getContainer()` and the `IAuthenticationGateway` port in `@repo/infra`. |
| **`@repo/application`** | Only the port **contract** (`AuthCookieApi`, `IAuthenticationGateway`, error DTOs). No IdP SDK. |
| **`@repo/infra`** | The **only** layer with `@supabase/supabase-js` / `@supabase/ssr` while that is the adapter. Another provider = new class + wiring. |

**Thin Next.js bridge:** a `createNextAuthCookieApi()` helper in `apps/site` can map `cookies()` from `next/headers` to `AuthCookieApi` — this is framework glue, **not** Supabase.

---

## Target flow (email + password) _(planned)_

```text
Browser       Backend (future)           @repo/infra                    DB
   │                    │                         │                          │
   │── POST sign-in ───►│── container.gateway ─────►│ adapter (e.g. Supabase)   │
   │                    │◄── Set-Cookie ───────────│                          │
   │                    │── principal (sub, email) ───────────────────────────►│
   │                    │── EnsureAppUserForAuthSession (planned)               │
   │                    │── GetCurrentUser(userId)                               │
   │◄── UserDTO ────────│                                                      │
```

1. Login: `POST /api/v1/auth/sign-in` — adapter validates at the IdP and sets session cookies.
2. Session: handlers read cookies via gateway → **`authSubject`** + email → repository resolves or creates `User`.
3. `GET /api/v1/me`: same pipeline through `GetCurrentUser`.

---

## Current state (code)

| Layer | Contents |
|-------|----------|
| **core** | `User`, `Role`, `IUserRepository`, `UnauthorizedError` |
| **application** | `GetCurrentUser`, `EnsureAdmin`, `UserDTO` |
| **infra** | `PrismaUserRepository`, `User` table |
| **Planned** | `IAuthenticationGateway`, `EnsureAppUserForAuthSession`, `authSubject` column, auth REST routes |

HTTP contract: [05-API-CONTRACTS](./05-API-CONTRACTS.md).

---

## Roles

- **ADMIN** — future admin UI (`/{locale}/admin/*`) and admin API endpoints (planned backend).
- **VISITOR** — authenticated without admin privileges; `GET /api/v1/me` allowed (planned); admin API → **401** after `EnsureAdmin`.

---

## Use cases (current and planned)

| Use case | Purpose | Status |
|----------|---------|--------|
| `GetCurrentUser` | Given a domain `userId`, returns `UserDTO`. | Implemented |
| `EnsureAdmin` | User exists and is `ADMIN`; otherwise `UnauthorizedError`. | Implemented |
| `EnsureAppUserForAuthSession` | Links `authSubject` to `User` (by subject or email) or creates a `VISITOR`. | **Planned** |

---

## UI _(planned)_

- `/{locale}/login` — form + `fetch` to **`POST /api/v1/auth/sign-in`** (no IdP SDK on the client).
- `/{locale}/admin/*` — dedicated admin app (`apps/admin`); data via `/api/v1/me` and `/api/v1/admin/*`.

---

## See Also

- [02-ARCHITECTURE](./02-ARCHITECTURE.md) — interface layer rules
- [04-APPLICATION-LAYER](./04-APPLICATION-LAYER.md) — ports and use cases
- [05-API-CONTRACTS](./05-API-CONTRACTS.md) — routes and error codes
- [ROADMAP](./ROADMAP.md)
