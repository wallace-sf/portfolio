# Identity e autenticação — plano de implementação (documentação)

> Este ficheiro descreve **o que implementar**, não código já feito. Contrato e conceitos: [docs/11-IDENTITY.md](../docs/11-IDENTITY.md), [docs/05-API-CONTRACTS.md](../docs/05-API-CONTRACTS.md).

## Princípios

- **Sem senha na tabela `User`:** credenciais no IdP (ex. Supabase `auth.users`); na app, `authSubject` + perfil + `role`.
- **Front sem SDK do IdP:** só `fetch` a `/api/v1/...`; `IAuthenticationGateway` + adaptador em `@repo/infra`.
- **REST obrigatório** para a camada externa; route handlers compõem container.

## Fase 0 — Porto `IAuthenticationGateway` (`@repo/application`)

- Contrato: `signInWithPassword`, `signOut`, `refreshSession`, `getPrincipalFromCookies`, com `AuthCookieApi` (sem tipos Next/Supabase no contrato).
- **Critério:** interface estável + testes com fake.

## Fase 1 — Domínio e dados: `authSubject`

- Migration Prisma: coluna `authSubject` (UUID, único, nullable até ao primeiro login).
- `IUserRepository`: `findByAuthSubject`, `linkAuthSubject`, e `save` alinhado ao agregado (se ainda não existir no contrato).
- Validação em `User` para `authSubject` opcional (UUID).

## Fase 2 — Adaptador Supabase (`@repo/infra`)

- `SupabaseAuthenticationGateway implements IAuthenticationGateway`.
- Dependências `@supabase/supabase-js`, `@supabase/ssr` **só** neste pacote.
- Env: `SUPABASE_URL`, `SUPABASE_ANON_KEY` (servidor; ver [.env.example](../.env.example)).
- Registar `authGateway` no `makeContainer()`.

## Fase 3 — REST: `auth/*`, `GET /api/v1/me`

- `POST /api/v1/auth/sign-in`, `sign-out`, `refresh`.
- `GET /api/v1/me` → gateway → `EnsureAppUserForAuthSession` → `GetCurrentUser`.
- Helper `createNextAuthCookieApi()` em `apps/web` (só `next/headers` → `AuthCookieApi`).

## Fase 4 — `/api/v1/admin/*`

- Mutations com `EnsureAdmin` + casos de uso de escrita (incremental). Ver tabela em [05-API-CONTRACTS](../docs/05-API-CONTRACTS.md).

## Fase 5 — UI

- `/{locale}/login` com `fetch` a sign-in.
- `/{locale}/admin/*` via `/api/v1/me` e APIs admin.
- Middleware: redirect sem cookie de sessão; **sem** `@supabase/*` no middleware.

## Riscos

- Prisma no Edge pode ser inviável — manter auth pesado em Route Handlers Node.
- CSRF / SameSite documentar na infra.

## Referências

- [docs/11-IDENTITY.md](../docs/11-IDENTITY.md)
- [docs/04-APPLICATION-LAYER.md](../docs/04-APPLICATION-LAYER.md)
- [docs/ROADMAP.md](../docs/ROADMAP.md)
