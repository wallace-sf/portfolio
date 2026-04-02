# PRD — Sprint 4: Quality, Deploy & Admin API surface

## Overview

This sprint covers **admin REST endpoints** under `/api/v1/admin/*`, hardening, CI/CD, and deployment — after core presentation and public API are stable. Aligned with GitHub milestone **Sprint 4 — Quality & Deploy** and [docs/ROADMAP.md](../../docs/ROADMAP.md).

## Goals

1. Implement **`/api/v1/admin/*`** mutations with `EnsureAdmin` and incremental resource coverage (**GitHub #446**).
2. Continue test coverage, lint, and deployment automation (existing Sprint 4 backlog items).

## Tasks

### T-ADMIN-API — REST admin endpoints with EnsureAdmin

**GitHub Issue**: #446  
**Priority**: Medium  
**Dependencies**: Identity session pipeline (**#445**) and public REST patterns established

Handlers under `/api/v1/admin/...` call `EnsureAdmin` before writes; responses per [05-API-CONTRACTS](../../docs/05-API-CONTRACTS.md).

---

## Definition of Done

- [ ] At least one admin mutation shipped with documented scope in PR
- [ ] 401/403 behaviour matches authorization table in `05`
- [ ] CI green on main branch for affected packages
