# 11 — Identity

> Bounded context de identidade: utilizadores, papéis e autorização. Complementa [03-BOUNDED-CONTEXTS](./03-BOUNDED-CONTEXTS.md) e [05-API-CONTRACTS](./05-API-CONTRACTS.md).

---

## O que é “auth” neste projeto

Em DDD, **Identity** é um **bounded context** próprio: modela *quem* é o utilizador e *que* pode fazer no sistema (via `Role` e casos de uso como `EnsureAdmin`). **Não** é apenas “middleware”: a regra de negócio “só ADMIN pode…” vive no domínio e na camada de aplicação.

- **Autenticação** (prova de identidade — sessão, JWT, Supabase Auth): mecanismo na **infra** + borda HTTP (cookies, headers).
- **Autorização** (permissão para uma ação): **`EnsureAdmin`**, futuros policies, e leitura de utilizador com **`GetCurrentUser`** — sempre invocados a partir de **route handlers**, nunca a partir de componentes React.

O **front-end** consome apenas **REST**; não importa `@repo/application` para Identity.

---

## Estado atual (código)

| Layer | Conteúdo |
|-------|----------|
| **core** (`@repo/core/identity`) | `User`, `Role`, `IUserRepository`, `UnauthorizedError` |
| **application** | `GetCurrentUser`, `EnsureAdmin`, `UserDTO` |
| **infra** | Implementação de `IUserRepository` (ex.: Prisma), utilizadores em BD |

Rotas HTTP (`/api/v1/me`, etc.) estão descritas em [05-API-CONTRACTS](./05-API-CONTRACTS.md); a implementação dos Route Handlers pode acompanhar o roadmap.

---

## Papéis

`Role` é um enum em `packages/core`:

- `ADMIN` — acesso a operações de gestão (quando expostas pela API).
- `VISITOR` — utilizador autenticado sem privilégios de administração.

`EnsureAdmin` devolve `UnauthorizedError` (código `UNAUTHORIZED`) quando o utilizador não é `ADMIN` — mapeado a **401** na API.

---

## Casos de uso

| Caso de uso | Finalidade |
|-------------|------------|
| `GetCurrentUser` | Dado um `userId` válido (já extraído da sessão na borda), devolve `UserDTO`. |
| `EnsureAdmin` | Garante que o utilizador existe e é `ADMIN`; caso contrário falha com `UnauthorizedError`. |

O **nível de acesso** a cada endpoint HTTP é definido na camada de interface: rotas públicas sem sessão; rotas autenticadas exigem sessão e passam `userId` aos casos de uso; rotas admin chamam `EnsureAdmin` antes de mutações.

---

## UI (planeado / em curso)

- `/[locale]/login` — login (email + senha ou fluxo do fornecedor).
- `/[locale]/admin/*` — área protegida; o servidor deve validar sessão e, nas operações sensíveis, alinhar com `EnsureAdmin` no handler.

Detalhes de fases em [plans/identity-mvp.md](../plans/identity-mvp.md) e [ROADMAP](./ROADMAP.md).

---

## Ver também

- [03-BOUNDED-CONTEXTS](./03-BOUNDED-CONTEXTS.md) — mapa de contextos
- [04-APPLICATION-LAYER](./04-APPLICATION-LAYER.md) — lista de casos de uso
- [ROADMAP](./ROADMAP.md) — fase Identity
- [packages/infra/README.md](../packages/infra/README.md) — schema e repositórios
