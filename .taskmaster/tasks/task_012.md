# Task ID: 12

**Title:** Document prose rewrite anti-pattern guidelines in project content instructions

**Status:** done

**Dependencies:** 11

**Priority:** medium

**Description:** Add "Avoiding AI-sounding prose" section to project content writing standards documenting em dash overuse, rule-of-three, and other LLM tells to avoid in portfolio project narratives.

**Details:**

This task documents the completed work of rewriting all 6 project content entries (18 translations total: EN/PT/ES) in `packages/infra/prisma/seeders.ts` to eliminate AI-sounding prose patterns, and codifying those patterns as anti-guidelines in `.github/instructions/project_content.instructions.md`.

**What was completed (PR #883, merged 2026-07-01):**

1. **Content rewrites in `packages/infra/prisma/seeders.ts`:**
   - Rewrote all 6 project `content` fields (lines 388, 818, 986, 1120, 1385, 1537) across all 3 languages (EN/PT/ES)
   - Reduced em dash usage from 454 occurrences to 7 across the entire file
   - Switched bullet separator in Technical Highlights from `**Label** — description` to `**Label**: description` (colon)
   - Broke up rule-of-three list patterns (e.g., constraint lists with exactly 3 items every time)
   - Cut "not X, it's Y" reframe structures to at most 1 per project
   - Mixed prose paragraphs into Technical Highlights sections instead of pure listicle format
   - Fixed duplicated Technologies section bug in buyr-shopify-app entry

2. **Documentation in `.github/instructions/project_content.instructions.md`:**
   - Added new section: "## Avoiding AI-sounding prose" (lines 111-123)
   - Documented 8 anti-patterns with explanations:
     - Em dash as default clause joiner
     - Forcing lists into groups of 3
     - "Not X — it's Y" reframe structures
     - Listicle-only sections (no prose)
     - Meta-commentary about the writing itself
     - Uniform sentence rhythm
     - Banned vocabulary list (leverage, seamless, robust, delve, etc.)
     - Missing lived texture (details only this project has)
   - Updated bullet label guidance (line 106) to specify colon separator and explain it's CSS-driven

3. **Deployment:**
   - PR #883 merged to `develop` on 2026-07-01
   - Promoted to `master` and deployed to production
   - Seed applied to both development and production Supabase instances

**Files modified:**
- `packages/infra/prisma/seeders.ts` (1829 lines total, 6 project entries rewritten)
- `.github/instructions/project_content.instructions.md` (added lines 111-123, updated line 106)

**Impact:**
- All portfolio project narratives now follow human-sounding prose standards
- Future project content additions will follow documented anti-AI-prose guidelines
- Reduced cognitive load for readers by varying sentence structure and list lengths
- Eliminated common LLM tells that trigger "this sounds like ChatGPT" reactions

This is a documentation task capturing completed editorial work, not a future implementation task.

**Test Strategy:**

**Verification (already completed):**

1. **Content quality check:**
   - Read through all 6 rewritten project entries in `packages/infra/prisma/seeders.ts` (lines 388, 818, 986, 1120, 1385, 1537)
   - Verify em dash count reduced from 454 to 7: `grep -o '—' packages/infra/prisma/seeders.ts | wc -l` → returns 7
   - Spot-check for varied list lengths (not all groups of 3)
   - Confirm Technical Highlights sections mix prose paragraphs with bullets
   - Check for concrete project-specific details (numbers, decisions, trade-offs)

2. **Documentation completeness:**
   - Read `.github/instructions/project_content.instructions.md` lines 111-123
   - Verify all 8 anti-patterns are documented with clear examples
   - Confirm bullet separator guidance updated (line 106: colon instead of em dash)
   - Check that banned vocabulary list is actionable

3. **Production verification:**
   - Confirm PR #883 merged to master: `gh pr view 883 --json state,mergedAt` → state: MERGED, mergedAt: 2026-07-01T01:18:28Z
   - Verify production portfolio site reflects new content (visit live site, check project detail pages)
   - Confirm Supabase production database has updated seed data

4. **Consistency check:**
   - Grep for residual "not X, it's Y" patterns: `grep -i "wasn't.*—.*it's\|not.*—.*it's" packages/infra/prisma/seeders.ts` → max 1 per project
   - Check for banned vocabulary: `grep -iE "(leverage|seamless|robust|delve|underscore)" packages/infra/prisma/seeders.ts` → minimal/zero hits in content fields
   - Verify buyr-shopify-app Technologies section appears only once (duplicated section bug fixed)

**Acceptance criteria (already met):**
- ✅ All 6 projects rewritten in all 3 languages
- ✅ Em dash usage reduced to ≤7 in entire file
- ✅ Anti-AI-prose guidelines documented
- ✅ PR merged and deployed to production
- ✅ Seeds applied to dev and prod databases
