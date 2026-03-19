# 11 — Identity (Planejado)

> Bounded context de autenticação e autorização. Plano detalhado para implementação futura.

## Contexto

Responsável por autenticação e autorização. Modelo binário: `ADMIN | VISITOR`. Supabase Auth como mecanismo; domínio em `packages/core`. Dependency rule: `core ← application ← infra ← web`.

## Context Map

| Context | Status | Modelos principais |
|---------|--------|--------------------|
| Identity | Planejado | User, Role, AccessPolicy, IUserRepository |

## Modelos previstos

- **User** — entidade: `auth_id`, `email`, `role`
- **Role** — VO: `ADMIN | VISITOR`
- **Email** — VO no Shared Kernel
- **AccessPolicy** — policy: `canPublish`, `canManageProjects`, `canAccessAdmin`, etc.
- **IUserRepository** — interface em core

## Rotas previstas

- `/[locale]/login` — página de login (email + senha)
- `/[locale]/admin/*` — área protegida; middleware + layout com `EnsureAdminUseCase`

## Plano de implementação

O plano detalhado por fases está em [plans/identity-mvp.md](../plans/identity-mvp.md).

## Ver também

- [03-BOUNDED-CONTEXTS](./03-BOUNDED-CONTEXTS.md) — mapa de contextos
- [ROADMAP](./ROADMAP.md) — fase Identity
- [packages/infra/README.md](../packages/infra/README.md) — schema `users`
