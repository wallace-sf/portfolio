# Open Issues Follow-up

Tracking doc for the GitHub issues still open after the 2026-07-24 audit of all
35 open issues. 25 issues were verified as already implemented in `develop` and
closed (see closing comments on each issue for evidence). The remaining 10 are
tracked here for later follow-up.

## Partial — real progress made, acceptance criteria not fully met

### [#917](https://github.com/wallace-sf/portfolio/issues/917) — Refactor ButtonLink to accept polymorphic Link component
- **Status:** Code done, tests missing.
- **Evidence:** `component` prop and usage with `component={Link}` implemented
  (`packages/ui/src/Control/Button/Link/index.tsx:11,19`;
  `apps/site/.../ProjectCard.tsx:116`).
- **Remaining work:** No Vitest/Testing Library test file exists for the
  package (no `vitest.config` or `*.test.tsx` under `packages/ui`). Project
  rule requires tests to ship with every implementation.

### [#665](https://github.com/wallace-sf/portfolio/issues/665) — Split ProjectCard and ExperienceCard into focused components
- **Status:** Underlying pain points resolved differently than prescribed.
- **Evidence:** `ProjectCard.tsx` (127 lines) was unified into one responsive
  component (commit `31936ba`), not split into `ProjectCardRow`/
  `ProjectCardGrid`. `ExperienceCard.tsx` (141 lines) no longer owns modal/
  scroll-lock logic (delegated to `SkillGroup`/`TechnologiesModal`).
- **Remaining work:** Decide whether the literal split is still wanted, or
  close as resolved-by-different-approach.

### [#612](https://github.com/wallace-sf/portfolio/issues/612) — Compile launch checklist and document MVP readiness
- **Status:** Partial artifacts exist.
- **Evidence:** `.taskmaster/docs/endpoint-testing-results.md` exists.
- **Remaining work:** No consolidated `launch-checklist.md` (or
  `orchestration-audit.md`) — the final launch-readiness doc was never
  produced.

## Not done — still open work

### [#664](https://github.com/wallace-sf/portfolio/issues/664) — Define semantic spacing tokens for section layout
- **Evidence:** No semantic spacing tokens in `apps/site/tailwind.config.ts`
  (only `header-desktop/mobile`). Ad hoc `py-8 lg:py-20` still in
  `apps/site/src/features/projects/ProjectsSection/index.tsx:8`; `my-6`/`my-8`
  still in `HomeProjectsSection.tsx:21` and `HeroSection/index.tsx:50`.

### [#663](https://github.com/wallace-sf/portfolio/issues/663) — Extract magic numbers in VOs to named constants
- **Evidence:** `packages/core/src/shared/vo/Name.ts:15` (`length(3, 100)`) and
  `Email.ts:17` (`length(3, 254)`) still use raw literals. Only `Slug.ts:10`
  has a named constant.

### [#662](https://github.com/wallace-sf/portfolio/issues/662) — Extract FETCH_FAILED / SAVE_FAILED into error code constants
- **Evidence:** String literals remain hardcoded in 14+ call sites across
  `packages/application/src/portfolio/use-cases/*.ts` and
  `identity/use-cases/*.ts`. No `ApplicationErrorCode` constant exists in
  `packages/application/src/shared/`.

### [#661](https://github.com/wallace-sf/portfolio/issues/661) — RFC: evaluate migration of @repo/ui components to shadcn/ui
- **Evidence:** No shadcn dependency in any `package.json`, no ADR/RFC
  document found in `docs/`. `@repo/ui` still has custom Modal/Button/
  Accordion/Badge/Radio/Divider implementations.
- **Remaining work:** The RFC decision itself was never made — needs a
  deliberate evaluation session, not just code changes.

### [#613](https://github.com/wallace-sf/portfolio/issues/613) — Update Validator usage examples across docs and CLAUDE.md
- **Evidence:** `docs/09-PATTERNS.md:54` still shows
  `.length(3, 100, 'Slug must be at least 3 characters.')` with a hardcoded
  message; `CLAUDE.md` "Domain Validation (core)" section still shows
  `.refine((v) => someRule(v), 'Rule A message.')` — the exact old pattern
  this issue asks to remove.

### [#627](https://github.com/wallace-sf/portfolio/issues/627) — Validate Open Graph preview in production
- **Evidence:** Manual production-verification checklist (OG preview via
  LinkedIn/Twitter validators); no artifact in the repo indicates it was run.
  Depends on a live deployment step that can't be confirmed from source alone.

## Post-MVP / deferred

### [#524](https://github.com/wallace-sf/portfolio/issues/524) — Intelligent project recommendation algorithm
- **Status:** Explicitly out of scope for now.
- **Evidence:** Issue body states "Fase: Pós-MVP — não bloqueia nenhuma
  funcionalidade atual". `PrismaProjectRepository.ts:58 findRelated` still
  uses stored `relatedProjectSlugs` (manual curation), no skill-overlap/
  embedding logic present.
- **Remaining work:** Revisit after MVP launch.
