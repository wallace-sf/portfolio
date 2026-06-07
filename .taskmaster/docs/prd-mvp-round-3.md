# PRD — MVP Round 3: General Code Review Fixes

## Overview

This sprint addresses all findings from the General Code Review conducted before the MVP launch. The work is grouped into three themes: **Hardcoded Strings & i18n**, **Accessibility (WCAG 2.1 AA)**, and **UX Bug Fixes**. All items in this PRD are mandatory for the MVP launch.

Reference issues: #647–#660 (GitHub milestone: MVP Round 3).

---

## Theme 1 — Hardcoded Strings & i18n

### 1.1 Centralize DEFAULT_LOCALE

The string `'en-US'` is hardcoded as a locale fallback in 7+ files. The central source of truth (`src/i18n/routing.ts`) already defines `defaultLocale: 'en-US'` but is not referenced anywhere.

**Files affected:**
- `apps/site/src/app/[locale]/page.tsx` (lines 21, 44)
- `apps/site/src/app/[locale]/about/page.tsx` (lines 23, 49)
- `apps/site/src/app/[locale]/projects/page.tsx` (lines 21, 39)
- `apps/site/src/components/Layout/SideNavigation/LanguageSelector.tsx:21`
- `apps/site/src/components/Layout/SideNavigation/MenuItem/Item1/index.tsx:22`
- `apps/site/src/app/feed.xml/route.ts:23`
- `apps/site/src/app/sitemap.ts:30`

**Requirements:**
- Export `DEFAULT_LOCALE` from `src/i18n/routing.ts`
- Replace all `?? 'en-US'` fallbacks and hardcoded `'en-US'` arguments with `DEFAULT_LOCALE`
- No `'en-US'` string literals remain outside the i18n config declaration

### 1.2 Replace locale.startsWith() with i18n in page metadata

Two pages build SEO metadata using raw `locale.startsWith('pt')` / `locale.startsWith('es')` string comparisons instead of the i18n system.

**Files affected:**
- `apps/site/src/app/[locale]/about/page.tsx:27`
- `apps/site/src/app/[locale]/projects/page.tsx:24–31`

**Requirements:**
- Add translation keys for page `title` and `description` under a `Metadata` namespace in all locale message files (EN, PT-BR, ES)
- Pages use `getTranslations('Metadata')` in `generateMetadata()`
- No `locale.startsWith()` calls remain in page files for UI copy

### 1.3 Fix INVALID_MESSAGE missing from ERROR_MESSAGE mapping

`SendContactMessage` use case returns a `ValidationError` with code `'INVALID_MESSAGE'`, but this code is not defined in `packages/core/src/shared/i18n/ERROR_MESSAGE.ts`. This is an active bug.

**Files affected:**
- `packages/application/src/contact/use-cases/SendContactMessage.ts:41`
- `packages/core/src/shared/i18n/ERROR_MESSAGE.ts`

**Requirements:**
- Add `INVALID_MESSAGE` entries (EN, PT-BR, ES) to `ERROR_MESSAGE.ts`, consistent with `INVALID_NAME` / `INVALID_EMAIL` patterns
- Add or update tests covering the `INVALID_MESSAGE` error path in `SendContactMessage`

### 1.4 Extract hardcoded Portuguese strings from TechnologiesModal

`TechnologiesModal` contains three UI strings hardcoded in Portuguese, breaking the English and Spanish versions.

**File:** `apps/site/src/features/about/TechnologiesModal/index.tsx` (lines 35, 54)

Hardcoded strings:
- `"Tecnologias utilizadas"` (modal title)
- `"Visão compacta"` (toggle label)
- `"Ver detalhes"` (toggle label)

**Requirements:**
- Add translation keys (`title`, `compactView`, `viewDetails`) to all locale message files
- `TechnologiesModal` uses `useTranslations()` for all three strings
- No Portuguese literals remain in component JSX

### 1.5 Fix hardcoded Portuguese aria-label in Modal close button

The Modal close button has `aria-label="Fechar modal"` hardcoded in Portuguese.

**File:** `packages/ui/src/Control/Modal/index.tsx`

**Requirements:**
- `Modal` accepts a `closeLabel` prop (string)
- All call sites pass the translated label
- No Portuguese literals remain in `@repo/ui` components

---

## Theme 2 — Accessibility (WCAG 2.1 AA)

All items in this theme are required to satisfy WCAG 2.1 Level AA, which is part of the MVP Definition of Done.

### 2.1 Add aria-label to ShareButton (icon-only button)

**File:** `apps/site/src/features/shared/ShareButton/index.tsx`

**Requirements:**
- Add a translated `aria-label` to the `Button.Clipboard` element (e.g. `t('share_button_label')`)
- Add the translation key to all locale message files
- When the icon shows the "copied" state, the label updates accordingly or an `aria-live` region announces the state change

### 2.2 Add aria-label to mobile menu toggle in Header

**File:** `apps/site/src/components/Layout/Header/index.tsx`

**Requirements:**
- Add `aria-label` or `aria-expanded` + `aria-controls` to the toggle button
- Label reflects open/close state
- Translation key added to all locale message files

### 2.3 Add aria-label to +N skills button in SkillGroup

**File:** `apps/site/src/features/shared/SkillGroup/index.tsx`

**Requirements:**
- Add `aria-label={t('show_all_skills', { count: n })}` to the overflow button
- Screen reader announces something like "Show all 5 skills"
- Translation key added to all locale message files

### 2.4 Add visible labels to ContactForm fields

**File:** `apps/site/src/features/contact/ContactForm/index.tsx`

The form fields have no `<label>` elements — they rely only on placeholder text, which disappears on focus and does not meet WCAG 2.1 SC 1.3.1.

**Requirements:**
- Each input (`name`, `email`, `message`) has an associated visible `<label>` with `htmlFor` / `id`
- Labels use translated text
- Required fields are visually indicated
- Existing `aria-invalid` / `aria-describedby` behaviour is preserved

### 2.5 Add visible focus indicators to Button.Base

**File:** `packages/ui/src/Control/Button/Base/index.tsx`

Button has zero focus styles — keyboard users receive no visual feedback. Violates WCAG 2.1 SC 2.4.7.

**Requirements:**
- All appearance variants (`filled`, `outline`, `ghost`) have a visible focus ring using `focus-visible:ring-2 focus-visible:ring-offset-2`
- Focus ring uses `focus-visible` (not `focus:`) to avoid showing on mouse click
- Focus ring visible in both light and dark themes

### 2.6 Add visible focus indicators to Text.Base and TextArea.Base

**Files:**
- `packages/ui/src/Control/Text/Base/index.tsx:42`
- `packages/ui/src/Control/TextArea/Base/index.tsx`

Both use `focus:outline-none` without a replacement. Only a faint border-color change is visible — insufficient.

**Requirements:**
- Replace `focus:outline-none` with `focus-visible:ring-2 focus-visible:ring-brand-primary`
- Focus style is consistent between both components
- Error and success states preserve the focus ring

### 2.7 Add visible focus indicator to Radio input

**File:** `packages/ui/src/Control/Radio/index.tsx:55`

Uses `focus:outline-none focus:ring-offset-0` with no replacement.

**Requirements:**
- Add `focus-visible:ring-2 focus-visible:ring-brand-primary` in place of removed styles
- Disabled state continues to suppress the focus ring

### 2.8 Fix heading hierarchy in HomeProjectsSection

**File:** `apps/site/src/features/home/ProjectsSection/HomeProjectsSection.tsx:19`

The home page uses `<h2>` in HeroBanner but `<h4>` in the Projects section, skipping `<h3>`. Screen reader users navigating by headings encounter a broken structure.

**Requirements:**
- Change `<h4>` to `<h3>` (or `<h2>` if it is the first section heading after the page `<h1>`)
- Verify the full heading hierarchy on the home page has no skipped levels
- Migrate the hardcoded `text-[32px]` to a Tailwind scale value (same commit)

---

## Theme 3 — UX Bug Fix

### 3.1 Add scroll lock to Modal component

**File:** `packages/ui/src/Control/Modal/index.tsx`

The Modal renders via `createPortal` but does not lock body scroll when open. On mobile, users can scroll the page behind an open modal. `ExperienceCard` works around this manually, but `ProjectCard` does not — the bug is active.

**Requirements:**
- Modal locks `document.body` scroll (`overflow: hidden`) when `open` is `true`
- Modal restores scroll on close and on unmount
- `ExperienceCard` manual scroll-lock calls can be removed once Modal handles it natively
- Verified on mobile viewport: page does not scroll behind an open modal

---

## Out of Scope for This PRD

The following were identified in the same review but are explicitly deferred to Post-MVP:

- shadcn/ui migration RFC
- Error code constants (`FETCH_FAILED` / `SAVE_FAILED`)
- VO magic numbers
- Spacing token system
- Split of `ProjectCard` / `ExperienceCard`
- Shared TechPill component + typography scale
