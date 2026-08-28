# @repo/layout

Shared layout and cross-zone navigation primitives for the multi-zone
deployment (`apps/site` + `apps/blog`).

Framework-aware (React / Next.js / next-intl) but presentational only — it never
imports `@repo/application`. Data comes in as props from the consuming app's
Server Components.

## Exports

| Path                      | Description                                                                         |
| ------------------------- | ----------------------------------------------------------------------------------- |
| `@repo/layout`            | `buildCrossZoneHref` — builds locale-preserving URLs across the `site`/`blog` zones |
| `@repo/layout/SiteHeader` | `SiteHeader` — the shared top bar (logo link + mobile hamburger toggle)             |

### `SiteHeader`

```tsx
'use client';
import { SiteHeader } from '@repo/layout/SiteHeader';
import logo from '~assets/images/logo.svg';

<SiteHeader
  locale={locale}
  logoSrc={logo.src}
  isOpen={isOpen}
  onToggle={onToggle}
/>;
```

Requirements in the consuming app:

- a `NextIntlClientProvider` with a `Header` message namespace
  (`logo_alt`, `openMenu`, `closeMenu`);
- `@repo/tailwind-config` wired into Tailwind, and
  `../../packages/layout/src/**/*.{ts,tsx}` added to the Tailwind `content` globs
  so the component's classes are generated.
