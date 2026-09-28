# apps/site — Portfolio front end

Next.js 16 with App Router, **next-intl** (pt-BR, en-US, es), Tailwind and `@repo/core` / `@repo/ui` / `@repo/utils`.

---

## Table of contents

- [Running locally](#running-locally)
- [Environment variables](#environment-variables)
- [Routes and pages](#routes-and-pages)
- [i18n](#i18n)
- [Scripts](#scripts)

---

## Running locally

From the **monorepo root**:

```bash
pnpm install
pnpm dev
```

Or just the site (from the root, after `pnpm install`):

   ```bash
   pnpm -C apps/site dev
   ```

- **URL**: `http://localhost:3000`
- **Locales**: `/`, `/pt-BR`, `/en-US`, `/es` (next-intl with `localeDetection` and an optional prefix, per [routing](src/i18n/routing.ts)).

---

## Environment variables

Copy the example and fill it in with credentials from the **dev** Supabase project:

```bash
cp apps/site/.env.example apps/site/.env.local
```

`.env.local` is loaded by both `next dev` and `next build` / `next start`, so every local build (including the one run by the `pre-push` hook) uses the **dev** project. **Don't create** `apps/site/.env.production.local`: `next build` gives it priority over `.env.local`, and local builds would then require production credentials.

Production lives only on Vercel, with variables set in the project settings. For the full per-package file map, see [docs/01-GETTING-STARTED.md](../../docs/01-GETTING-STARTED.md#environment-variables).

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_CONTACT_EMAIL` | No | Contact email |
| `NEXT_PUBLIC_CONTACT_NUMBER` | No | Phone number |
| `NEXT_PUBLIC_GITHUB_URL` | No | GitHub link |
| `NEXT_PUBLIC_LINKEDIN_URL` | No | LinkedIn link |
| `NEXT_PUBLIC_RESUME_URL` | No | Resume link |
| `NEXT_PUBLIC_WHATSAPP_URL` | No | WhatsApp link |

The app works without them; links and contact details are left empty. **Don't commit** any `.env*` file (except `.env.example`).

For the database and Supabase, see [docs/02-ARCHITECTURE.md](../../docs/02-ARCHITECTURE.md) and [packages/infra/README.md](../../packages/infra/README.md).

---

## Routes and pages

Structure under `src/app/[locale]/`:

| Route | File | Description |
|-------|------|-------------|
| `/`, `/pt-BR`, `/en-US`, `/es` | `page.tsx` | Home: hero, projects, contact form |
| `/[locale]/about` | `about/page.tsx` | About me |
| `/[locale]/projects` | `projects/page.tsx` | Project list |
| `/[locale]/...rest` | `[...rest]/page.tsx` | Catch-all (e.g. 404) |

`[locale]` is handled by next-intl; `routing.locales`: `['en-US','es','pt-BR']`, `defaultLocale`: `'en-US'`.

---

## i18n

- **Library**: [next-intl](https://next-intl-docs.vercel.app)
- **Config**:
  - `src/i18n/routing.ts` — locales, default, `createNavigation` (Link, redirect, usePathname, useRouter)
  - `src/i18n/request.ts` — `getRequestConfig`, loads `messages/{locale}.json`
- **Messages**: `messages/pt-BR.json`, `messages/en-US.json`, `messages/es.json`
- **Usage**: `useTranslations('Key')` (e.g. `useTranslations('Home')`)

Strategy details (UI + domain, LocalizedText, fallback): [docs/07-I18N.md](../../docs/07-I18N.md).

---

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | `next dev` |
| `pnpm build` | `next build` |
| `pnpm start` | `next start` (after build) |
| `pnpm lint` | ESLint with --fix |
| `pnpm lint:check` | ESLint without --fix |
| `pnpm format` | Prettier on `src` |
| `pnpm format:check` | Prettier check |
| `pnpm types` | `tsc --noEmit` |
| `pnpm test` | Vitest |

Dev/build use `NEXT_PUBLIC_*` (see `turbo.json` at the root).
