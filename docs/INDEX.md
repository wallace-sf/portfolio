# Portfolio Monorepo — Documentation Index

> **Single source of truth for all project documentation.**
> Start here to find any topic — each concept appears exactly once.

---

## Quick Navigation

| Goal | Go to |
|------|-------|
| New to the project? | [00-INTRODUCTION](./00-INTRODUCTION.md) |
| Setting up locally? | [01-GETTING-STARTED](./01-GETTING-STARTED.md) |
| Understand architecture and layers? | [02-ARCHITECTURE](./02-ARCHITECTURE.md) |
| Understand DDD, contexts, and aggregates? | [03-BOUNDED-CONTEXTS](./03-BOUNDED-CONTEXTS.md) |
| Working on use cases or ports? | [04-APPLICATION-LAYER](./04-APPLICATION-LAYER.md) |
| Working on API routes or error handling? | [05-API-CONTRACTS](./05-API-CONTRACTS.md) |
| Working on validation? | [06-VALIDATION](./06-VALIDATION.md) |
| Working on i18n? | [07-I18N](./07-I18N.md) |
| Writing or reviewing tests? | [08-TESTING](./08-TESTING.md) |
| Looking for code templates (Either, VO, Entity)? | [09-PATTERNS](./09-PATTERNS.md) |
| Looking for a domain term? | [10-GLOSSARY](./10-GLOSSARY.md) |

---

## Complete Documentation Map

### Foundation (00–03)

- **[00-INTRODUCTION](./00-INTRODUCTION.md)** — Project vision, goals, tech stack summary
- **[01-GETTING-STARTED](./01-GETTING-STARTED.md)** — Installation, monorepo setup, dev workflow
- **[02-ARCHITECTURE](./02-ARCHITECTURE.md)** — Clean Architecture, dependency rule, layer responsibilities, ESLint enforcement
- **[03-BOUNDED-CONTEXTS](./03-BOUNDED-CONTEXTS.md)** — DDD contexts (Portfolio, Blog, Contact), aggregates, Shared Kernel, `packages/core` structure

### Application & Interface (04–07)

- **[04-APPLICATION-LAYER](./04-APPLICATION-LAYER.md)** — Use cases, ports, DTOs, orchestration
- **[05-API-CONTRACTS](./05-API-CONTRACTS.md)** — API envelope, error codes, HTTP mapping
- **[06-VALIDATION](./06-VALIDATION.md)** — Edge validation (Zod) vs domain invariants (Either)
- **[07-I18N](./07-I18N.md)** — UI translations, domain content localization, locale routing

### Quality & Patterns (08–10)

- **[08-TESTING](./08-TESTING.md)** — Testing strategy, builders, coverage criteria, TDD workflow
- **[09-PATTERNS](./09-PATTERNS.md)** — DDD patterns (Either, VO, Entity, Repository templates), GoF patterns
- **[10-GLOSSARY](./10-GLOSSARY.md)** — Ubiquitous language: domain terms, architectural terms, process terms

---

## Cross-References

- **[CLAUDE.md](../CLAUDE.md)** — Operational quick reference for Claude Code; links here for deep documentation
- **[packages/core/README.md](../packages/core/README.md)** — Core package overview, links to 02-ARCHITECTURE and 03-BOUNDED-CONTEXTS
- **[packages/core/decisions/](../packages/core/decisions/)** — Architectural Decision Records (ADRs)
- **[ROADMAP.md](./ROADMAP.md)** — Product roadmap and sprint planning

---

## Documentation Principles

1. **Single Source of Truth** — each concept appears in exactly one authoritative location
2. **Numbered for reading order** — read 00 → 10 or jump directly to the topic
3. **Current state vs target** — where they differ, the target is the direction for new code
4. **CLAUDE.md is the operational guide** — this index is the knowledge base
