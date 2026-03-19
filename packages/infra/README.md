# packages/infra — Infraestrutura (Supabase, adapters, mappers)

**Status: WIP** — Este pacote ainda **não está implementado**. O README descreve o plano alinhado à Clean Architecture e ao uso de Supabase.

---

## Índice

- [Objetivo](#objetivo)
- [Supabase](#supabase)
- [Schema de BD (high-level)](#schema-de-bd-high-level)
- [Repositórios e ports](#repositórios-e-ports)
- [Mappers](#mappers)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Estrutura planejada](#estrutura-planejada)

---

## Objetivo

- Implementar os **ports** (interfaces de repositório e serviços) definidos em `packages/application` (ou em `docs/APPLICATION.md`).
- **Supabase (supabase-js)** como cliente de Postgres, Auth e (opcional) Realtime para o MVP.
- **Mappers**: linhas/tipos do BD ↔ entidades e VOs do `@repo/core`.
- Manter o domínio e a Application **livres** de detalhes de Supabase; toda a lógica de cliente e SQL fica na Infra.

---

## Supabase

- **Função**: Postgres (tabelas `projects`, `posts`, `tags`, etc.), Auth (se necessário para admin/Contact) e Realtime (opcional para Blog).
- **Cliente**: `@supabase/supabase-js` no Node e, se fizer sentido, no edge (Route Handlers Next.js).
- **Variáveis**: `SUPABASE_URL`, `SUPABASE_ANON_KEY`; em contextos server-only, `SUPABASE_SERVICE_ROLE_KEY` — **nunca expor no client**.

---

## Schema de BD (high-level)

Visão prevista (nomes e colunas podem mudar na implementação):

### Portfolio

- **`projects`**: `id`, `title`, `caption`, `content`, `created_at`, `updated_at`, `deleted_at` (+ colunas i18n se for o caso: `title_pt`, `title_en`, etc.)
- **`project_skills`** ou skills embedded (JSONB) conforme decisão de modelo.
- **`experiences`**: `id`, `company`, `position`, `start_at`, `end_at`, `location`, `location_type`, `employment_type`, `created_at`, …
- **`skills`**: `id`, `description`, `icon`, `type`, …

### Blog

- **`posts`**: `id`, `slug`, `title`, `body`, `status`, `published_at`, `created_at`, `updated_at`
- **`tags`**: `id`, `slug`, `name`
- **`post_tags`**: `post_id`, `tag_id`

### Contact (opcional)

- **`contacts`** ou integração com serviço externo (Resend, etc.); a definir.

### Identity (planejado)

- **`users`**: `id`, `auth_id` (uuid, FK auth.users), `email`, `role` (ADMIN/VISITOR), `created_at`, `updated_at`, `deleted_at`
- RLS: leitura própria; escrita apenas via service_role

---

## Repositórios e ports

Cada repositório na Infra implementa uma interface (port) da Application, por exemplo:

- **`IProjectRepository`** → `ProjectRepositorySupabase`: `findAll()`, `findById(id)`
- **`IPostRepository`** → `PostRepositorySupabase`: `findPublished(limit, offset, tag?)`, `findBySlug(slug)`
- **`ITagRepository`** → `TagRepositorySupabase`: `findAll()`
- **`IUserRepository`** → `SupabaseUserRepository`: `findByAuthId()`, `findByEmail()`, `save()`
- **`IContactSender`** (ou similar) → adapter para Supabase/Resend/etc.

Os nomes exatos dos ports e métodos serão definidos em `packages/application` ou em [docs/APPLICATION.md](../docs/APPLICATION.md).

---

## Mappers

- **`ProjectMapper`**: `row` → `IProjectProps` / `Project` (incluindo `SkillFactory.bulk` para skills).
- **`PostMapper`**: `row` (+ joins com tags) → DTO ou entidade `BlogPost` (quando existir no Core).
- **`TagMapper`**: `row` → `Tag` ou VO.

Responsabilidades:

- Conversão de tipos (datas, UUIDs, enums).
- **Não** incluir lógica de domínio; apenas transformação de dados.
- Decoding/validação “bruta” do BD pode usar **Zod** na borda da Infra; ver [docs/VALIDATION.md](../docs/VALIDATION.md).

---

## Variáveis de ambiente

| Variável | Obrigatória | Uso |
|----------|-------------|-----|
| `SUPABASE_URL` | Sim (quando Infra ativa) | URL do projeto Supabase |
| `SUPABASE_ANON_KEY` | Sim | Chave anônima (browser/edge) |
| `SUPABASE_SERVICE_ROLE_KEY` | Depende | Apenas server-side; nunca no client |

Onde definir: em `apps/web` (Route Handlers) ou em `apps/api` (futuro); o pacote `infra` apenas lê via `process.env` ou via um config injetado.

---

## Estrutura planejada

```
packages/infra/
├── src/
│   ├── supabase/
│   │   ├── client.ts        # createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
│   │   └── ...
│   ├── repositories/
│   │   ├── ProjectRepositorySupabase.ts
│   │   ├── PostRepositorySupabase.ts
│   │   ├── SupabaseUserRepository.ts
│   │   └── TagRepositorySupabase.ts
│   ├── mappers/
│   │   ├── ProjectMapper.ts
│   │   ├── PostMapper.ts
│   │   └── TagMapper.ts
│   └── index.ts
├── package.json
└── README.md (este arquivo)
```

- **Dependências**: `@repo/core`, `@supabase/supabase-js`; opcional: `zod` para decoding de rows.
- **Exporta**: repositórios e, se útil, mappers; **não** exporta o client Supabase diretamente para fora da Infra (encapsular atrás dos repos).
