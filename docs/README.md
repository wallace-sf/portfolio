# Documentation Index

This directory contains architecture, domain, and engineering guidance for the monorepo.

## Main Guides

- `ARCHITECTURE.md`: overview of Clean Architecture, DDD, layers, and key decisions
- `BOUNDED_CONTEXTS.md`: context map, responsibilities, and integrations
- `APPLICATION.md`: planned structure of the application layer, use cases, and ports
- `API.md`: strategy and contracts for the planned API
- `ERROR_HANDLING.md`: error codes, HTTP envelope, and translation at the edge
- `I18N.md`: internationalization strategy for UI and domain content
- `VALIDATION.md`: validation at the edge with Zod and invariants in the domain
- `TESTING.md`: testing strategy, builders, test suites, and quality criteria
- `GLOSSARY.md`: ubiquitous language and architectural terms

## Supporting Files

- `ROADMAP.md`: product direction and implementation phases
- `000-template.md`: raw template for ADRs or decision records; not operational project documentation

## Notes

- Some documents describe both the **current state** and planned parts of the system (`WIP`), especially `APPLICATION.md` and `API.md`.
- If there is any divergence between **current state** and **target model**, treat the **target model** as the official direction for new code and the **current state** as migration context.
- When updating architecture or process guidance, prefer changing the specific document first and keeping `CLAUDE.md` as an operational summary.
