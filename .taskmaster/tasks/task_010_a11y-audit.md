# Task ID: 10

**Title:** Fix landmark structure in SideNavigation: replace outer section with div and add aria-label to inner nav

**Status:** pending

**Dependencies:** None

**Priority:** medium

**Description:** Replace the outer section element with a div in SideNavigation component (line 26) since it's a layout container, not a thematic section. Add aria-label to the inner nav element (line 28) with i18n key to distinguish it from other nav landmarks like ContactInfo's navigation.

**Details:**

**Current Issue:**
The SideNavigation component (`apps/site/src/components/Layout/SideNavigation/index.tsx`) has two accessibility issues:

1. **Outer section misuse** (line 26): The outer `<section>` element is used as a fixed-position layout container, not as a thematic section of the document. Per HTML Standard (WHATWG), `<section>` should represent thematic groupings with headings. This container serves only for CSS positioning and should be a `<div>`.

2. **Missing aria-label on nav landmark** (line 28): The inner `<nav id="side-navigation">` element lacks an accessible name. When pages contain multiple `<nav>` landmarks (e.g., SideNavigation at line 28 + ContactInfo's `<nav>` at `apps/site/src/features/contact/ContactInfo/index.tsx:83`), screen readers cannot distinguish between them without explicit labels.

**Root Cause Analysis:**

1. **Outer section element** (line 26):
   - Current: `<section className="fixed top-0 left-0 shadow-1 w-full xl:w-auto z-50">`
   - Purpose: Fixed positioning wrapper for Header + nav layout
   - No heading child or thematic content grouping
   - Violates semantic HTML guidelines

2. **Inner nav element** (line 28):
   - Current: `<nav id="side-navigation" className={...}>`
   - Semantically correct as navigation landmark
   - Missing `aria-label` attribute for screen reader context
   - Multiple `<nav>` elements exist on pages (ContactInfo footer also has a `<nav>` at line 83)

**Implementation Steps:**

1. **Replace outer section with div** (line 26):
   ```tsx
   // Before:
   <section className="fixed top-0 left-0 shadow-1 w-full xl:w-auto z-50">
   
   // After:
   <div className="fixed top-0 left-0 shadow-1 w-full xl:w-auto z-50">
   ```

2. **Add aria-label to inner nav** (line 28):
   ```tsx
   // Before:
   <nav
     id="side-navigation"
     className={classNames(...)}
   >
   
   // After:
   <nav
     id="side-navigation"
     aria-label={t('mainNav')}
     className={classNames(...)}
   >
   ```
   The component already imports `useTranslations('SideNavigation')` at line 18, so the `t()` function is available.

3. **Add closing div tag** (line 85):
   ```tsx
   // Before:
   </section>
   
   // After:
   </div>
   ```

4. **Add translation keys to all three locale files:**

   **File: `apps/site/messages/en-US.json`**
   Add to the `"SideNavigation"` object (after line 46):
   ```json
   "SideNavigation": {
     "home": "Home",
     "projects": "Projects",
     "about": "About",
     "resume": "Resume",
     "language": "Language",
     "theme": "Theme",
     "linkedin": "LinkedIn",
     "github": "GitHub",
     "rss": "RSS Feed",
     "mainNav": "Main navigation"
   }
   ```

   **File: `apps/site/messages/pt-BR.json`**
   Add to the `"SideNavigation"` object (after line 46):
   ```json
   "SideNavigation": {
     "home": "Início",
     "projects": "Projetos",
     "about": "Sobre mim",
     "resume": "Currículo",
     "language": "Idioma",
     "theme": "Tema",
     "linkedin": "LinkedIn",
     "github": "GitHub",
     "rss": "RSS Feed",
     "mainNav": "Navegação principal"
   }
   ```

   **File: `apps/site/messages/es.json`**
   Add to the `"SideNavigation"` object (after line 46):
   ```json
   "SideNavigation": {
     "home": "Inicio",
     "projects": "Proyectos",
     "about": "Sobre mí",
     "resume": "Currículum",
     "language": "Idioma",
     "theme": "Tema",
     "linkedin": "LinkedIn",
     "github": "GitHub",
     "rss": "RSS Feed",
     "mainNav": "Navegación principal"
   }
   ```

**Expected Outcome:**
- Outer container uses semantically correct `<div>` element
- Inner `<nav>` has unique accessible name via `aria-label`
- Screen readers announce "Main navigation" (or localized equivalent) when focusing the nav landmark
- Pages with multiple nav landmarks (SideNavigation + ContactInfo) are distinguishable

**Test Strategy:**

**Manual Testing:**

1. **Visual Regression:**
   - Start dev server: `pnpm dev` (port 3000)
   - Visit all pages in all 3 locales:
     - Home: `http://localhost:3000/en-US`, `/pt-BR`, `/es`
     - Projects: `http://localhost:3000/en-US/projects`, `/pt-BR/projetos`, `/es/proyectos`
     - About: `http://localhost:3000/en-US/about`, `/pt-BR/sobre`, `/es/acerca`
   - **Expected result:** No visual changes — layout, positioning, and styling remain identical

2. **Screen Reader Testing (NVDA/JAWS on Windows, VoiceOver on macOS):**
   - Start screen reader
   - Navigate to any page with both SideNavigation and ContactInfo (e.g., Home page)
   - Use landmark navigation (NVDA: D key, VoiceOver: VO+U then arrows to landmarks)
   - **Expected result for en-US:** Two nav landmarks announced:
     - "Main navigation" (SideNavigation)
     - "navigation" (ContactInfo footer — will need aria-label in separate task)
   - **Expected result for pt-BR:** "Navegação principal"
   - **Expected result for es:** "Navegación principal"

3. **Browser DevTools Accessibility Inspector:**
   - Open DevTools → Accessibility tab
   - Inspect the `<nav id="side-navigation">` element
   - **Expected result:** Accessible name shows "Main navigation" (or localized)
   - Verify outer container is `<div>`, not `<section>`

**Automated Testing:**

1. **Pa11y Accessibility Audit:**
   - Ensure dev server is running: `pnpm dev` (port 3000)
   - Run Pa11y CI: `pnpm run pa11y` or `pa11y-ci`
   - **Expected result:** 0 new violations related to unlabeled navigation landmarks or misuse of section elements
   - Verify existing violation counts don't increase

2. **Axe DevTools Extension:**
   - Install axe DevTools browser extension
   - Visit all pages across all locales
   - Run full accessibility scan
   - **Expected result:** 0 violations for:
     - "Navigation landmarks should have a unique label" (or similar)
     - "Sections should contain headings" (or similar for misused section)

**Code Review Checklist:**

- [ ] Outer `<section>` changed to `<div>` at line 26 in `apps/site/src/components/Layout/SideNavigation/index.tsx`
- [ ] Closing `</section>` changed to `</div>` at line 85
- [ ] `aria-label={t('mainNav')}` added to `<nav>` element at line 28
- [ ] Translation key `"mainNav": "Main navigation"` added to `apps/site/messages/en-US.json`
- [ ] Translation key `"mainNav": "Navegação principal"` added to `apps/site/messages/pt-BR.json`
- [ ] Translation key `"mainNav": "Navegación principal"` added to `apps/site/messages/es.json`
- [ ] No TypeScript compilation errors: `pnpm build` (or `turbo build`)
- [ ] No linting errors: `pnpm lint`

**TypeScript Type Checking:**
- Run type check: `pnpm tsc --noEmit` or `turbo run type-check` (if configured)
- **Expected result:** 0 type errors related to the changes
