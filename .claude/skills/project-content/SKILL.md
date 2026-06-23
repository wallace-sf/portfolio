---
name: project-content
description: Write or edit project content for the portfolio — narrative structure, Technologies section, highlight syntax, and tone. Use when writing the content field of a project seed entry.
---

# Project Content Writing

## Use when

- User asks to write, edit, or review the `content` field of a project in `packages/infra/prisma/seeders.ts`
- User mentions **project narrative**, **content writing**, **project description**, **escrever projeto**, or **conteúdo do projeto**
- User wants to add a new project to the portfolio and needs to draft the prose

## Reference (single source of truth)

- [project_content.instructions.md](../../../.github/instructions/project_content.instructions.md) — narrative structure, required sections (including Technologies), standard questions, and tone guidelines

Do not duplicate content here; the instructions file is the authoritative source.

## Workflow

1. **Collect context** — if the project is new, work through the standard questions from the instructions file conversationally. The user may answer freely; map answers to the question framework.
2. **Draft** — follow the narrative structure: opening → Constraints → Contribution sections → Technologies → Technical Highlights
3. **Apply markdown features** — use `==text==` for 3–5 key highlights, `**Label** —` for bullet items, `*caption*` after images
4. **Write to seeder** — the final content goes in `packages/infra/prisma/seeders.ts` as the `content` field of the project entry
5. **Run seed** — always run `pnpm run seed` after editing the seeder to apply changes
