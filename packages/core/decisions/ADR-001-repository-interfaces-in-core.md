# ADR-001: Repository Interfaces Belong in Core, Not Application

## Status

Accepted

## Context

In Clean Architecture, repository interfaces (ports) can be placed in either the **domain layer** (`packages/core`) or the **application layer** (`packages/application`). Both are valid interpretations of the pattern.

In this monorepo, we needed to decide where to define contracts like `IProjectRepository`, `IExperienceRepository`, `IProfileRepository`, and `ISkillRepository`.

The key constraint: `packages/infra` (which implements the repositories) must depend on the layer that defines the interfaces. Placing the interfaces in `packages/application` would require `infra` to depend on `application` — which is valid in some architectures but creates a tighter coupling than necessary here.

## Decision

Repository interfaces are defined in `packages/core` alongside their respective aggregate roots, not in `packages/application`.

Structure:

```
packages/core/src/portfolio/entities/project/repositories/IProjectRepository.ts
packages/core/src/portfolio/entities/experience/repositories/IExperienceRepository.ts
packages/core/src/portfolio/entities/profile/repositories/IProfileRepository.ts
packages/core/src/portfolio/entities/skill/repositories/ISkillRepository.ts
```

The pattern is: **repository interface lives next to its aggregate root**.

Dependency flow:

```
core (defines interface) ← application (uses interface) ← infra (implements interface)
```

## Consequences

**Positive:**

- High cohesion — the interface and its aggregate root are co-located
- The domain defines its own persistence contract (true DDD)
- `packages/application` does not need to define infrastructure contracts
- Easier discoverability: to understand what operations are available for an entity, look in its own directory
- `packages/infra` only needs to depend on `packages/core`, not on `packages/application`

**Negative:**

- Differs from some popular Clean Architecture implementations that place all ports in `application`
- Requires this ADR to document the intentional deviation

## Alternatives Considered

1. **Application Layer Interfaces** — place in `packages/application/ports/repositories/`:
   - Rejected: separates the interface from its entity, reducing cohesion; forces `infra` to depend on `application`

2. **Separate Ports Package** — create `packages/ports`:
   - Rejected: over-engineering for this monorepo size; adds an extra package with no clear benefit over co-location with entities
