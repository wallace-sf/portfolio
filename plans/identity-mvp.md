# Identity — Plano de Implementação (MVP)

> Bounded context de autenticação e autorização. **Status:** planejado, não implementado.

## Decisões arquiteturais

- **Modelo de papéis**: binário `ADMIN | VISITOR`
- **Auth**: Supabase Auth (`@supabase/supabase-js`, `@supabase/ssr`)
- **Rotas protegidas**: `/[locale]/admin/*` → middleware + layout com `EnsureAdminUseCase`
- **Rotas públicas**: login em `/[locale]/login`
- **Fora do escopo MVP**: logout, magic link/OAuth, audit log, notification

## Fases resumidas

| Fase | Conteúdo |
|------|----------|
| 0 | Setup `packages/application` (identity), `packages/infra`, `apps/web` |
| 1 | Core: Email, Role, User, UnauthorizedError, IUserRepository, AccessPolicy |
| 2 | Infra: migration `users`, SupabaseUserRepository, seed admin |
| 3 | Application: GetCurrentUserUseCase, EnsureAdminUseCase |
| 4 | Web: getAuthenticatedUser, middleware, login, layout admin |

Ver documento completo em [docs/11-IDENTITY.md](../docs/11-IDENTITY.md).
