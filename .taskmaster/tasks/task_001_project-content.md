# Task ID: 1

**Title:** Rewrite all 6 project content entries to reduce AI-sounding prose

**Status:** done

**Dependencies:** None

**Priority:** medium

**Description:** Comprehensive rewrite of all project narratives (EN/PT/ES) in seeders.ts to eliminate AI-writing tells: em-dash overuse, rule-of-three lists, "not X, it's Y" reframes, and listicle-only Technical Highlights sections

**Details:**

## Implementation Context

This task involved rewriting the `content` field for all 6 projects in `packages/infra/prisma/seeders.ts`, across all 3 languages (EN/PT/ES = 18 total rewrites), to remove recognizable AI-writing patterns that made the portfolio sound generic and overly polished.

## Changes Made

### Content Rewrites (seeders.ts)
- **Em-dash reduction**: Cut em-dash usage from 454 occurrences to 7 (only in code comments and mermaid diagrams, not in narrative prose)
- **Bullet separator change**: Switched from `**Label** — description` to `**Label**: description` format throughout all projects. This was safe because the accent-color styling in `packages/ui/globals.css` (lines 85-93) targets `li > strong:first-child`, not the separator character itself
- **Structural changes**:
  - Replaced rule-of-three lists with naturally-varying list lengths (2, 4, 5 items instead of forcing 3)
  - Removed "not X, it's Y" reframe patterns (e.g., "This wasn't optional — it was required")
  - Mixed prose paragraphs into Technical Highlights sections instead of pure bullet lists
  - Added concrete, project-specific details to replace generic statements
  - Varied sentence rhythm and length within sections
  - Eliminated banned LLM vocabulary (leverage, seamless, robust, delve, etc.)

### Bug Fix
- **Buyr project**: Removed a duplicated `## Technologies` section that appeared twice in the English version
- **Buyr title**: Changed from `Buyr — Shopify App` to `Buyr: Shopify App` (consistent with colon separator)

### Documentation Update
- Added comprehensive "Avoiding AI-sounding prose" section to `.github/instructions/project_content.instructions.md` (lines 111-123) documenting all the patterns to avoid in future content writing

## Files Modified

1. `packages/infra/prisma/seeders.ts` (839 lines changed)
   - All 6 projects rewritten: Buyr, Seidor, Galaxies, Stattus4, Portfolio, and one other
   - Each project had EN/PT/ES versions rewritten (18 total content blocks)
   
2. `.github/instructions/project_content.instructions.md` (17 lines added)
   - New section: "Avoiding AI-sounding prose"
   - Lists 8 specific anti-patterns with guidance on each

## Technical Approach

The rewrite followed the existing narrative structure (Constraints → Context → Contribution → Result) but improved the prose quality by:
- Reading each section aloud to catch unnatural rhythm
- Checking for "could this apply to any similar project?" and adding concrete details when yes
- Mixing short, blunt sentences with longer ones
- Using periods and commas instead of defaulting to em-dashes
- Preserving technical accuracy while improving readability

## Deployment

- PR #883 merged to `develop` branch on 2026-07-01
- Subsequently promoted to `master`/production
- Seed applied to both dev (`portfolio-dev`) and production Supabase databases
- All 18 project detail pages (6 projects × 3 languages) verified returning 200 with updated content

**Test Strategy:**

## Verification Steps

### Code Quality
- [x] Run `tsc --noEmit` in `packages/infra` to verify TypeScript compilation
- [x] Run `pnpm run seed` against dev database to verify seeders.ts executes without errors
- [x] Verify no syntax errors in the seeders.ts file (all template literals properly closed)

### Content Integrity
- [x] Verify all 6 projects still have `content` fields in all 3 languages (EN/PT/ES)
- [x] Check that no project content was accidentally deleted during rewrite
- [x] Confirm Technologies sections are present and well-formed for all projects
- [x] Verify no duplicated sections remain (especially in Buyr project)

### Prose Quality Checks
- [x] Run em-dash count: `grep -o "—" packages/infra/prisma/seeders.ts | wc -l` (should be ≤10, all in non-prose context)
- [x] Spot-check 3-4 projects for absence of banned vocabulary (leverage, seamless, robust, delve)
- [x] Verify bullet labels use colon format: `**Label**: description`
- [x] Check Technical Highlights sections mix bullets with prose paragraphs

### Visual/Functional Testing
- [x] Start local dev server and visit all 6 project detail pages in English
- [x] Switch locale and verify Portuguese versions render correctly
- [x] Switch locale and verify Spanish versions render correctly
- [x] Verify CSS styling for bullet labels works correctly (accent color on bold text)
- [x] Check that no layout breaks occurred from content changes

### Production Verification
- [x] Verify seed was applied to production Supabase database
- [x] Spot-check 2-3 project pages in production environment
- [x] Confirm no 404s or missing content errors in production logs

### Documentation
- [x] Verify `.github/instructions/project_content.instructions.md` contains new "Avoiding AI-sounding prose" section
- [x] Confirm the section lists all 8 anti-patterns with clear guidance
