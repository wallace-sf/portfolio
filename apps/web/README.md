# apps/web — Front-end do portfolio

Next.js 14 com App Router, **next-intl** (pt-BR, en-US, es), Tailwind e `@repo/core` / `@repo/ui` / `@repo/utils`.

---

## Índice

- [Como rodar](#como-rodar)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Rotas e páginas](#rotas-e-páginas)
- [i18n](#i18n)
- [Scripts](#scripts)

---

## Como rodar

Na **raiz do monorepo**:

```bash
pnpm install
pnpm dev
```

Ou só o web (a partir da raiz, após `pnpm install`):

   ```bash
   pnpm -C apps/web dev
   ```

- **URL**: `http://localhost:3000`
- **Locales**: `/`, `/pt-BR`, `/en-US`, `/es` (next-intl com `localeDetection` e prefixo opcional conforme [routing](src/i18n/routing.ts)).

---

## Variáveis de ambiente

Copie o exemplo e edite conforme necessário:

```bash
cp apps/web/.env.example apps/web/.env.local
```

| Variável | Obrigatória | Uso |
|----------|-------------|-----|
| `NEXT_PUBLIC_CONTACT_EMAIL` | Não | E-mail de contato |
| `NEXT_PUBLIC_CONTACT_NUMBER` | Não | Telefone |
| `NEXT_PUBLIC_GITHUB_URL` | Não | Link GitHub |
| `NEXT_PUBLIC_LINKEDIN_URL` | Não | Link LinkedIn |
| `NEXT_PUBLIC_RESUME_URL` | Não | Link do currículo |
| `NEXT_PUBLIC_WHATSAPP_URL` | Não | Link WhatsApp |

O app funciona sem elas; links e contatos ficam vazios. **Não commitar** `.env` ou `.env.local`.

Para Supabase (quando implementado), ver [docs/ARCHITECTURE.md](../../docs/ARCHITECTURE.md) e [packages/infra/README.md](../../packages/infra/README.md).

---

## Rotas e páginas

Estrutura sob `src/app/[locale]/`:

| Rota | Arquivo | Descrição |
|------|---------|-----------|
| `/`, `/pt-BR`, `/en-US`, `/es` | `page.tsx` | Home: hero, projetos, formulário de contato |
| `/[locale]/about` | `about/page.tsx` | Sobre mim |
| `/[locale]/projects` | `projects/page.tsx` | Listagem de projetos |
| `/[locale]/...rest` | `[...rest]/page.tsx` | Catch-all (ex.: 404) |

`[locale]` é gerenciado pelo next-intl; `routing.locales`: `['en-US','es','pt-BR']`, `defaultLocale`: `'en-US'`.

---

## i18n

- **Biblioteca**: [next-intl](https://next-intl-docs.vercel.app)
- **Config**:
  - `src/i18n/routing.ts` — locales, default, `createNavigation` (Link, redirect, usePathname, useRouter)
  - `src/i18n/request.ts` — `getRequestConfig`, carrega `messages/{locale}.json`
- **Mensagens**: `messages/pt-BR.json`, `messages/en-US.json`, `messages/es.json`
- **Uso**: `useTranslations('Chave')` (ex.: `useTranslations('Home')`)

Detalhes da estratégia (UI + domínio, LocalizedText, fallback): [docs/I18N.md](../../docs/I18N.md).

---

## Scripts

| Comando | Descrição |
|---------|-----------|
| `pnpm dev` | `next dev` |
| `pnpm build` | `next build` |
| `pnpm start` | `next start` (pós-build) |
| `pnpm lint` | ESLint com --fix |
| `pnpm lint:check` | ESLint sem --fix |
| `pnpm format` | Prettier em `src` |
| `pnpm format:check` | Checagem Prettier |
| `pnpm types` | `tsc --noEmit` |
| `pnpm test` | Jest |

Dev/build usam `NEXT_PUBLIC_*` (ver `turbo.json` na raiz).
