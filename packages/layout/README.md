# @repo/layout

Shared layout and cross-zone navigation primitives for the multi-zone
deployment (`apps/site` + `apps/blog`).

Framework-aware (React / Next.js / next-intl) but presentational only — it never
imports `@repo/application`. Data comes in as props from the consuming app's
Server Components.

## Exports

| Path                      | Description                                                                         |
| ------------------------- | --------------------------------------------------------------------------------- |
| `@repo/layout`            | `buildCrossZoneHref` — builds locale-preserving URLs across the `site`/`blog` zones |
| `@repo/layout/SiteHeader` | `SiteHeader` — the shared top bar (logo link + mobile hamburger toggle)             |
| `@repo/layout/SiteFooter` | `SiteFooter` — the shared footer band (`<footer>` shell); content via `children`    |
| `@repo/layout/SiteLogo`   | `SiteLogo` — the inlined brand mark (`<svg>`, forwards all SVG props)               |

### `SiteHeader`

```tsx
'use client';
import { SiteHeader } from '@repo/layout/SiteHeader';

<SiteHeader locale={locale} isOpen={isOpen} onToggle={onToggle} />;
```

The brand logo is inlined by the package (`SiteLogo`) — apps don't pass an asset.

### `SiteFooter`

```tsx
import { SiteFooter } from '@repo/layout/SiteFooter';

<SiteFooter>
  <ContactSection /> {/* or any zone-specific footer content */}
</SiteFooter>;
```

Owns the footer band chrome (max width, surface, padding, top border, upward
shadow); the child provides the content.

Requirements in the consuming app:

- a `NextIntlClientProvider` with a `Header` message namespace
  (`logo_alt`, `openMenu`, `closeMenu`);
- `@repo/tailwind-config` wired into Tailwind, and
  `../../packages/layout/src/**/*.{ts,tsx}` added to the Tailwind `content` globs
  so the component's classes are generated.
