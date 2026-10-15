# 12 — Design System

> `@repo/ui` — shared React component library used across `apps/site` and `apps/admin`.

---

## Overview

`@repo/ui` is a `'use client'`-ready component library built with React and Tailwind CSS. It is bundled by **tsup** and organized into three namespaces:

| Namespace | Import path | Components |
|-----------|-------------|------------|
| **Control** | `@repo/ui/Control` | Accordion, Button, Input, Label, Modal, Radio, RadioGroup, TextArea, Text, ToggleGroup |
| **Imagery** | `@repo/ui/Imagery` | Icon |
| **View** | `@repo/ui/View` | Badge, Divider, Markdown, SectionHeader |

---

## Usage

```typescript
import { Button } from '@repo/ui/Control';
import { Icon } from '@repo/ui/Imagery';
import { Badge, Markdown } from '@repo/ui/View';
```

Components with hooks (e.g. `Modal`, interactive controls) are safe to use inside `'use client'` boundaries. `Markdown` is the opposite: an async Server Component that only Server Components can render (see below).

---

## Control

### Accordion

Collapsible section with `Root`, `Header`, and `Body` sub-components.

```tsx
<Accordion.Root>
  <Accordion.Header>Title</Accordion.Header>
  <Accordion.Body>Content</Accordion.Body>
</Accordion.Root>
```

### Button

Multiple variants via sub-components:

| Sub-component | Purpose |
|---------------|---------|
| `Button.Base` | Standard action button |
| `Button.Link` | Styled link (`next/link`) |
| `Button.Clipboard` | Copy-to-clipboard with feedback |
| `Button.Toggle` | Single toggle (pressed state) |
| `Button.ToggleGroup` | Grouped exclusive toggles |

### Input / TextArea / Label

Standard form controls. Use with React Hook Form `register`.

### Modal

Dialog overlay. Renders into a portal; use within a `'use client'` component.

### RadioGroup / Radio

Accessible radio selection. Composed as `RadioGroup` + `Radio` children.

---

## Imagery

### Icon

Renders an icon by name using the project's icon library.

```tsx
<Icon icon="github" className="text-xl" />
```

---

## View

### Badge

Inline tag with optional icon or count. Three variants:

| Sub-component | Usage |
|---------------|-------|
| `Badge.Text` | Label only |
| `Badge.WithIcon` | Label + icon |
| `Badge.Count` | Numeric count (e.g. `+3`) |

### Divider

Full-width horizontal rule. Accepts `className` for spacing overrides.

### SectionHeader

Page/section heading with optional overline and description. Accepts an `as` prop for semantic heading level (`h1`–`h6`).

```tsx
<SectionHeader
  overline="Projects"
  title="My Work"
  description="A selection of things I've built."
  as="h2"
  align="center"
/>
```

### Markdown

An **async Server Component** that renders Markdown at build time: GitHub-Flavored
Markdown, `==highlight==` (`<mark>`), Shiki syntax highlighting and **Mermaid
diagrams**. It is the single Markdown renderer for portfolio content and blog posts.

```tsx
<Markdown content={markdownString} className="text-content-disabled" />
```

It renders inside `.markdown-body`, the site's **single** Markdown typography:
GitHub's stylesheet (`github-markdown-css`) plus design-token overrides in
`globals.css`. `className` adds classes to that container. There is no second,
hand-written typography layer; a different style gets designed only when a real
case needs it.

A Client Component cannot render it, so its Server Component parent renders it
and passes the result down as `children`:

```tsx
// Server Component
<ExperienceCard {...experience}>
  {description && <Markdown content={description} />}
</ExperienceCard>
```

**Light / dark:** `github-markdown.css` styles everything through CSS variables
but switches its palettes on `prefers-color-scheme`. `markdown-theme.css`
re-keys GitHub's dark palette to `.markdown-body` (the default) and its light
palette to `.light .markdown-body`, so it follows the site's theme toggle. The
file is generated from the installed package (`pnpm --filter @repo/ui
generate:markdown-theme`), and a test fails if it drifts after an upgrade.

**Pipeline:** `remark-parse → remark-gfm → remark-mark-highlight → remark-rehype →
rehype-sanitize → mermaid → rehype-pretty-code`. Raw HTML is never rendered, and
input is sanitized before the trusted transforms (whose inline styles the sanitizer
would otherwise strip).

**Mermaid:** ` ```mermaid ` fences become `MermaidBlock`, the only client island. It
loads the Mermaid runtime from a CDN on mount and renders the SVG.

```markdown
```mermaid
flowchart TD
  A[Client] --> B[Server Component]
  B --> C[Use Case]
  C --> D[(Database)]
```
```

---

## Bundle structure

tsup produces one chunk per namespace, plus one entry per client island:

```text
dist/
  Control/index.mjs           → interactive form/control components
  Imagery/index.mjs           → Icon
  View/index.mjs              → Badge, Divider, Markdown, SectionHeader
  View/MermaidBlock/index.mjs → 'use client' island, imported by Markdown
```

esbuild drops module directives when bundling, so a client island that a Server
Component imports gets its own tsup entry with a `'use client'` banner, and is
imported through its package path (`@repo/ui/View/MermaidBlock`, kept external)
so the boundary survives the bundle.

---

## Adding a new component

1. Create `src/<Namespace>/<ComponentName>/index.tsx` (one component per file)
2. Export from `src/<Namespace>/index.ts`
3. If the component uses React hooks, add `'use client'` at the top of the component file
4. **Never** use hooks at module level in the namespace `index.ts` barrel — this keeps the bundle compatible with Server Component imports
5. Add tests in `packages/ui/src/<Namespace>/<ComponentName>/`; tests are mandatory for new components

---

## See Also

- **[02-ARCHITECTURE](./02-ARCHITECTURE.md)** — `'use client'` boundary rules
- **[08-TESTING](./08-TESTING.md)** — Component testing strategy
- **[ROADMAP](./ROADMAP.md)** — Design system sprint history
