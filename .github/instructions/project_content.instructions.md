---
description: Standards for writing project content in the portfolio — narrative structure, required sections, questions to answer, and tone guidelines.
applyTo: "packages/infra/prisma/seeders.ts"
---

# Project Content Writing Standards

These instructions apply whenever writing or editing the `content` field of a project in the seed file (`packages/infra/prisma/seeders.ts`).

---

## Narrative Structure

Every project follows this order: **Constraints first → Context → Contribution → Result**

This structure works because it answers, in order, the questions a recruiter or senior dev actually asks:
1. *Was this hard?* (Constraints)
2. *What did you do?* (Contribution)
3. *Did it work?* (Result)

---

## Required Sections

### Opening paragraph (no heading)
- 1–2 sentences establishing what the product does and who it serves
- Mention the central constraint or unusual aspect of the project
- Sets tone: credibility over marketing

### `## The Constraints`
- What made this project difficult or non-obvious
- Technical constraints, environment, timeline, team distribution
- **Do not list technologies here** — this block is about context and tension

### `## [Area of Contribution]` (e.g. `## Storefront`, `## Merchant Admin`)
- What you specifically built, owned, or solved
- Use ownership verbs: *built*, *designed*, *owned*, *architected*, *led*, *solved*, *investigated*
- Sub-sections with `###` for distinct workstreams within the same area

### `## Technologies`
- List the main technologies with links to official documentation
- One sentence per item describing the role it played in this specific project
- **Order**: most central to most peripheral
- Include only what helps the reader understand the project — not every tool touched

```markdown
## Technologies

- [React](https://react.dev) — storefront widget and merchant admin UI
- [Framer Motion](https://www.framer.com/motion/) — animation system for the offer lifecycle states
```

### `## Technical Highlights`
- Architecture and technical decisions that are non-obvious
- Each bullet answers "why does this matter", not just "what was done"
- Format: `**Decision** — justification or impact`

---

## Standard Questions

Answer these before writing the first draft. Mark `n/a` for anything confidential or not applicable.

**Context**
- [ ] What did the product do for the end user? (one sentence)
- [ ] Who used it? (user type, scale — e.g. "800+ operators", "internal team of 10")
- [ ] What was the state when you joined? (greenfield, legacy, in production)

**Constraints**
- [ ] Was there a fixed deadline?
- [ ] Were there technical constraints from the environment?
- [ ] Was the team distributed? How many people, which countries?
- [ ] Any business rules or compliance that complicated technical decisions?

**Your contribution**
- [ ] What was your specific responsibility? (feature, module, layer, full product)
- [ ] Did you have full ownership or were you part of a larger team?
- [ ] What was the most important technical decision you made?
- [ ] What did you build from scratch vs. what did you evolve?

**Technical**
- [ ] What was the main stack?
- [ ] Any non-obvious architecture decision worth mentioning?
- [ ] Was there a hard technical problem you solved? How?
- [ ] Which technologies deserve a link to documentation?

**Result**
- [ ] Did it ship to production? Is it in use?
- [ ] Any impact metric? (users, volume, time saved, error reduction)
- [ ] If no numbers: what was the state before vs. after?

**Visibility**
- [ ] Can the company/product name be cited?
- [ ] Are there screenshots, links, or visual material available?
- [ ] Any information that cannot appear publicly?

---

## Tone Guidelines

- Write from the perspective of someone who solved a problem, not someone listing skills
- Avoid: *"I used React to build..."* → prefer: *"Built with React, the widget..."*
- Keep technical English — no marketing jargon
- Target length: 250–400 words in the rendered `content` field
- Use `==text==` to highlight 3–5 key phrases the reader will scan for
- Use `**Label** — description` format for bullet items (label gets accent color)
- Use `*italic caption*` as the only content in a paragraph after an image (renders as caption)
