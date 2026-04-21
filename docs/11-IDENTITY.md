# 11 — Identity

> Bounded context de identidade: utilizadores, papéis, **autenticação** (sessão) e **autorização** (admin). Complementa [03-BOUNDED-CONTEXTS](./03-BOUNDED-CONTEXTS.md) e [05-API-CONTRACTS](./05-API-CONTRACTS.md).

---

## O que é “auth” neste projeto

Em DDD, **Identity** é um **bounded context** próprio: modela *quem* é o utilizador e *que* pode fazer no sistema (via `Role` e casos de uso como `EnsureAdmin`). **Não** é apenas “middleware”: a regra “só ADMIN pode…” vive no domínio e na camada de aplicação.

- **Autenticação** (sessão, credenciais): deve ser abstraída por um **porto na application** (`IAuthenticationGateway`), com **implementação na infra** (ex.: Supabase). O **front-end** não referencia o SDK do fornecedor.
- **Autorização:** **`EnsureAdmin`**, **`GetCurrentUser`**, e futuros casos de uso — invocados **apenas** a partir de **route handlers**, nunca a partir de componentes React.

O **front-end** consome apenas **REST**; não importa `@repo/application` nem **`@supabase/*`**.

---

## Senhas e `authSubject` (modelo alvo)

- **O projeto não armazena senhas** na tabela de aplicação (`User` no Prisma). Credenciais ficam no **provedor de auth** (ex.: `auth.users` no Supabase).
- Na **tua** base guardas perfil e papéis, e uma coluna estável que liga à conta de auth — por exemplo **`authSubject`** (UUID igual ao id do utilizador no Supabase Auth / claim `sub` do JWT).
- Fluxo mental: `auth.users` (IdP) ↔ `User` (Prisma) via `authSubject`; email e nome podem existir nos dois lados, mas a **senha** só no IdP.

---

## Fornecedor plugável (Clean Architecture)

| Layer | O que pode saber sobre Supabase (ou outro IdP) |
|-------|-----------------------------------------------|
| **`apps/web` (UI, `middleware.ts`)** | **Nada.** Só `fetch` a `/api/v1/...`. |
| **`apps/web/app/api/**` (Route Handlers)** | **Não** importar `@supabase/*`. Usar `getContainer()` e o porto `IAuthenticationGateway` em `@repo/infra`. |
| **`@repo/application`** | Só o **contrato** do porto (`AuthCookieApi`, `IAuthenticationGateway`, DTOs de erro). Sem SDK do IdP. |
| **`@repo/infra`** | **Única** camada com `@supabase/supabase-js` / `@supabase/ssr` enquanto esse for o adaptador. Outro fornecedor = nova classe + wiring. |

**Ponte Next.js (fina):** um helper `createNextAuthCookieApi()` em `apps/web` pode mapear `cookies()` de `next/headers` para `AuthCookieApi` — é cola de framework, **não** é Supabase.

---

## Fluxo alvo (email + password)

```text
Browser          Route Handler              @repo/infra                    BD
   │                    │                         │                          │
   │── POST sign-in ───►│── container.gateway ─────►│ adaptador (ex. Supabase)  │
   │                    │◄── Set-Cookie ───────────│                          │
   │                    │── principal (sub, email) ───────────────────────────►│
   │                    │── EnsureAppUserForAuthSession (planeado)              │
   │                    │── GetCurrentUser(userId)                               │
   │◄── UserDTO ────────│                                                      │
```

1. Login: `POST /api/v1/auth/sign-in` com JSON `{ email, password }` — o adaptador valida no IdP e define cookies de sessão.
2. Sessão: handlers leem cookies via gateway → **`authSubject`** + email → repositório resolve ou cria `User` (ver [plans/identity-mvp.md](../plans/identity-mvp.md)).
3. `GET /api/v1/me`: mesmo pipeline até `GetCurrentUser`.

---

## Estado atual (código)

| Layer | Conteúdo |
|-------|----------|
| **core** | `User`, `Role`, `IUserRepository`, `UnauthorizedError` |
| **application** | `GetCurrentUser`, `EnsureAdmin`, `UserDTO` |
| **infra** | `PrismaUserRepository`, tabela `User` |
| **Planeado** | `IAuthenticationGateway`, `EnsureAppUserForAuthSession`, coluna `authSubject`, rotas `auth/*`, handlers REST |

Contrato HTTP: [05-API-CONTRACTS](./05-API-CONTRACTS.md). Plano por fases: [plans/identity-mvp.md](../plans/identity-mvp.md).

---

## Papéis

- **ADMIN** — endpoints `/api/v1/admin/*` e UI `/{locale}/admin/*` (quando existirem).
- **VISITOR** — autenticado sem privilégios de admin; `GET /api/v1/me` permitido; admin API → **401** após `EnsureAdmin`.

---

## Casos de uso (hoje e alvo)

| Caso de uso | Finalidade | Estado |
|-------------|------------|--------|
| `GetCurrentUser` | Dado `userId` de domínio, devolve `UserDTO`. | Implementado |
| `EnsureAdmin` | Utilizador existe e é `ADMIN`; senão `UnauthorizedError`. | Implementado |
| `EnsureAppUserForAuthSession` | Liga `authSubject` ao `User` (por subject ou email) ou cria `VISITOR`. | **Planeado** |

---

## UI (planeado)

- `/{locale}/login` — formulário + `fetch` a **`POST /api/v1/auth/sign-in`** (sem SDK do IdP no cliente).
- `/{locale}/admin/*` — dados via `/api/v1/me` e `/api/v1/admin/*`.

---

## Ver também

- [02-ARCHITECTURE](./02-ARCHITECTURE.md) — regras da camada interface
- [04-APPLICATION-LAYER](./04-APPLICATION-LAYER.md) — portos e casos de uso
- [05-API-CONTRACTS](./05-API-CONTRACTS.md) — rotas e códigos de erro
- [ROADMAP](./ROADMAP.md)
- [packages/infra/README.md](../packages/infra/README.md)
