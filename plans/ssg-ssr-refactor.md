# Plano: Migração das Pages do Site para SSG/ISR

## Objetivo

Converter todas as pages públicas de `apps/site` de SSR dinâmico (`force-dynamic` + fetch HTTP interno)
para SSG/ISR com chamada direta aos use cases, eliminando a ida e volta HTTP desnecessária e
aproveitando o CDN da Vercel para máxima performance.

## Contexto

Hoje as pages fazem:
```
Server Component → fetch('/api/v1/...') → API Route → Use Case → Prisma → DB
```

Após a refatoração:
```
Build/Revalidação → Server Component → Use Case → Prisma → DB → HTML no CDN
Visitante → recebe HTML pronto
```

As rotas `/api/v1/...` continuam existindo para o **admin** (CSR).

---

## Páginas afetadas

| Página | Rota | Use Cases envolvidos |
|--------|------|----------------------|
| Home | `/` | `GetProfile`, `GetFeaturedProjects`, `GetProfessionalValues` |
| About | `/about` | `GetProfile`, `GetExperiences`, `GetProfessionalValues` |
| Projects | `/projects` | `GetProjects` |
| Project Detail | `/projects/[slug]` | `GetProjectBySlug` |

---

## Fases

### Fase 1 — Infraestrutura compartilhada

**Objetivo:** Preparar o terreno sem tocar nas pages ainda.

- [ ] Criar helper `getServerContainer()` em `apps/site/src/lib/server/container.ts`
  - Encapsula `getContainer()` de `@repo/infra` para uso nas pages
  - Evita importar `@repo/infra` espalhado pelas pages
- [ ] Remover `getInternalBaseUrl()` de `apps/site/src/lib/api/internal.ts`
  - Ou manter apenas para rotas que permanecerem dinâmicas (contato, auth)
- [ ] Definir `REVALIDATE_SECONDS` como constante de configuração (ex.: `86400` = 24h)

**Commit:** `feat(site): add server container helper for SSG pages`

---

### Fase 2 — Home page (`/`)

**Objetivo:** Primeira page migrada como tracer bullet.

- [ ] Substituir fetch HTTP por chamadas diretas aos use cases em `page.tsx`
- [ ] Adicionar `export const revalidate = 86400`
- [ ] Remover `loading.tsx` da rota `/`
- [ ] Remover o Skeleton correspondente (se exclusivo desta rota)

**Commit:** `feat(site/home): migrate to SSG with direct use case calls`

---

### Fase 3 — About page (`/about`)

- [ ] Substituir fetch HTTP por use cases diretos em `page.tsx`
- [ ] Adicionar `export const revalidate = 86400`
- [ ] Remover `loading.tsx` da rota `/about`
- [ ] Remover Skeletons correspondentes

**Commit:** `feat(site/about): migrate to SSG with direct use case calls`

---

### Fase 4 — Projects list (`/projects`)

- [ ] Substituir fetch HTTP por `GetProjects` direto em `page.tsx`
- [ ] Adicionar `export const revalidate = 86400`
- [ ] Remover `loading.tsx` da rota `/projects`
- [ ] Remover Skeletons correspondentes

**Commit:** `feat(site/projects): migrate to SSG with direct use case calls`

---

### Fase 5 — Project detail (`/projects/[slug]`)

- [ ] Substituir fetch HTTP por `GetProjectBySlug` direto em `page.tsx`
- [ ] Adicionar `generateStaticParams` usando `GetProjects` direto (sem fetch HTTP)
- [ ] Remover `export const dynamic = 'force-dynamic'`
- [ ] Adicionar `export const revalidate = 86400`
- [ ] Remover `loading.tsx` da rota `/projects/[slug]`

**Commit:** `feat(site/project-detail): migrate to ISR with generateStaticParams`

---

### Fase 6 — Limpeza final

- [ ] Remover `getInternalBaseUrl` se não houver mais usos nas pages
- [ ] Avaliar se `/api/v1/projects`, `/api/v1/experiences`, `/api/v1/professional-values`,
  `/api/v1/profile` ainda têm consumidores além do admin — se não, marcar como admin-only
- [ ] Atualizar testes de page que mockavam fetch HTTP

**Commit:** `chore(site): remove unused internal fetch helpers after SSG migration`

---

## Decisões

### Tempo de revalidação
`86400s` (24h) é um bom ponto de partida para um portfolio. Pode ser ajustado por rota:
- Home/About/Projects: 24h (dados muito estáveis)
- Project detail: 24h (conteúdo muda raramente)

### `dynamicParams` no project detail
Com `generateStaticParams`, slugs não listados no build retornam 404 por padrão.
Para gerar sob demanda (primeiro acesso gera e cacheia), manter `dynamicParams = true` (já é o padrão do Next.js).

### Skeletons e `loading.tsx`
Com SSG/ISR, o HTML chega completo — não há estado de carregamento visível.
Os `loading.tsx` e Skeletons das rotas migradas podem ser removidos com segurança.
Manter apenas para rotas que permanecerem dinâmicas (contato).
