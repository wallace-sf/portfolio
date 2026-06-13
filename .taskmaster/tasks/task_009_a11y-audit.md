# Task ID: 9

**Title:** Replace inner section elements with div in HeroBanner component

**Status:** pending

**Dependencies:** None

**Priority:** medium

**Description:** Replace two inner section elements (image container at line 40 and text container at line 51) with div elements in the HeroBanner component, as these are purely CSS layout wrappers with no semantic meaning per the HTML Standard (WHATWG) requirement that section should represent thematic groupings with headings.

**Details:**

**Current Issue:**
The HeroBanner component (`apps/site/src/features/shared/HeroBanner/index.tsx`) contains three nested `<section>` elements:

1. **Outer section** (line 34): Semantically correct — represents the hero region with a heading child (`TitleTag` at line 58)
2. **Image container section** (line 40, `className='relative h-64...'`): Purely a CSS layout wrapper for the Next.js Image component
3. **Text container section** (line 51, `className='flex flex-col px-6...'`): Purely a CSS layout wrapper for the text content

**Root Cause:**
Per the [HTML Living Standard (WHATWG)](https://html.spec.whatwg.org/multipage/sections.html#the-section-element), the `<section>` element represents a thematic grouping of content, typically with a heading. The two inner sections are structural containers used only for flexbox layout, containing no headings and representing no distinct thematic content. They violate the semantic purpose of `<section>`.

**Solution:**
Replace both inner `<section>` elements with `<div>` elements:

1. **Line 40**: Change `<section className="relative h-64...">` to `<div className="relative h-64...">`
2. **Line 51**: Change `<section className={classNames('flex flex-col px-6...')}>` to `<div className={classNames('flex flex-col px-6...')}>`
3. Update corresponding closing tags (lines 50 and 72)

**Additional Consideration:**
The HeroBannerSkeleton component (`apps/site/src/features/shared/HeroBanner/HeroBannerSkeleton.tsx`) also uses nested `<section>` elements at lines 4 and 13 for layout purposes only. Apply the same fix to maintain consistency:
- Line 4: Change `<section className="flex flex-col...">` to `<div className="flex flex-col...">`
- Line 13: Change `<section className="xl:order-1...">` to `<div className="xl:order-1...">`

**No Behavioral Impact:**
This is a purely structural change. The `<div>` element has identical CSS layout capabilities as `<section>`, so no visual or functional changes will occur. This change only improves semantic HTML correctness.

**Test Strategy:**

**Manual Testing:**

1. **Visual Regression:**
   - Start dev server: `pnpm dev` (port 3000)
   - Visit all pages that use HeroBanner:
     - Home: `http://localhost:3000/en-US`, `/pt-BR`, `/es`
     - Projects: `http://localhost:3000/en-US/projects`, `/pt-BR/projetos`, `/es/proyectos`
     - About: `http://localhost:3000/en-US/about`, `/pt-BR/sobre`, `/es/acerca-de`
   - **Expected result:** All pages render identically to before (layout, spacing, responsive behavior)
   - Test responsive breakpoints: mobile (<640px), tablet (640-1280px), desktop (>1280px)

2. **DOM Structure Validation:**
   - Inspect DOM with browser DevTools on each page
   - **Expected result:**
     - Outer `<section>` element remains unchanged
     - Two inner containers are now `<div>` elements (image container and text container)
     - No other structural changes

**Automated Testing:**

1. **Pa11y/Axe Accessibility Audit:**
   - Run Pa11y CI: `pnpm run pa11y` or `pa11y-ci`
   - **Expected result:** 0 new violations; all existing violations remain unchanged
   - This change should not introduce accessibility regressions

2. **Component Testing (if applicable):**
   - If HeroBanner has existing component tests, verify they still pass
   - Run: `pnpm test` (or relevant test command)
   - **Expected result:** All tests pass without modification

**Semantic HTML Validation:**

1. **W3C HTML Validator:**
   - Navigate to `http://localhost:3000/en-US` in browser
   - Use [W3C Nu HTML Checker](https://validator.w3.org/nu/) with "Check by address" option
   - **Expected result:** No warnings about improper use of `<section>` elements in HeroBanner

2. **Heading Map Audit:**
   - Run heading map script: `node scripts/heading-map.mjs`
   - **Expected result:** No changes to heading hierarchy (outer section still contains the TitleTag heading)
