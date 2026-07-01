# Task ID: 10

**Title:** Define repository interfaces for infrastructure contracts

**Status:** done

**Dependencies:** 7, 8, 9

**Priority:** high

**Description:** Create repository interface definitions in the domain layer to establish contracts for the infrastructure layer implementation

**Details:**

Create repository interfaces in respective entity directories:

1. `packages/core/src/portfolio/entities/project/repositories/IProjectRepository.ts`:
```typescript
import { Project } from '../model/Project';
import { ProjectId } from '../value-objects/ProjectId';
import { Slug } from '../../../../shared/vo/Slug';

export interface IProjectRepository {
  findAll(): Promise<Project[]>;
  findPublished(): Promise<Project[]>;
  findFeatured(): Promise<Project[]>;
  findById(id: ProjectId): Promise<Project | null>;
  findBySlug(slug: Slug): Promise<Project | null>;
  findRelated(id: ProjectId, limit?: number): Promise<Project[]>;
  save(project: Project): Promise<void>;
  delete(id: ProjectId): Promise<void>;
}
```

2. `packages/core/src/portfolio/entities/experience/repositories/IExperienceRepository.ts`:
```typescript
import { Experience } from '../model/Experience';
import { Id } from '../../../../shared/vo/Id';

export interface IExperienceRepository {
  findAll(): Promise<Experience[]>;
  findById(id: Id): Promise<Experience | null>;
  save(experience: Experience): Promise<void>;
  delete(id: Id): Promise<void>;
}
```

3. `packages/core/src/portfolio/entities/profile/repositories/IProfileRepository.ts`:
```typescript
import { Profile } from '../model/Profile';
import { Id } from '../../../../shared/vo/Id';

export interface IProfileRepository {
  find(): Promise<Profile | null>; // Singleton pattern - only one profile
  save(profile: Profile): Promise<void>;
}
```

4. `packages/core/src/portfolio/entities/skill/repositories/ISkillRepository.ts`:
```typescript
import { Skill } from '../model/Skill';
import { Id } from '../../../../shared/vo/Id';

export interface ISkillRepository {
  findAll(): Promise<Skill[]>;
  findById(id: Id): Promise<Skill | null>;
  save(skill: Skill): Promise<void>;
  delete(id: Id): Promise<void>;
}
```

Key principles:
- All interfaces use domain types (entities, VOs) - never primitives
- No imports of external libraries (Prisma, Supabase, etc.)
- Methods return Promise for async operations
- Repository pattern for each aggregate root

Update `packages/core/src/portfolio/index.ts` to export all four interfaces.

**Test Strategy:**

Validation (no unit tests needed for interfaces):

1. TypeScript compilation:
   - Run `pnpm types` in packages/core
   - Verify no type errors
   - Confirm interfaces are exported from portfolio index

2. Architecture validation:
   - Grep for external imports in repository files:
     ```bash
     grep -r "from 'prisma\|from '@prisma\|from 'supabase" packages/core/src/portfolio/*/repositories/
     ```
   - Should return no results

3. Export validation:
   - Verify `packages/core/src/portfolio/index.ts` exports:
     - IProjectRepository
     - IExperienceRepository
     - IProfileRepository
     - ISkillRepository

4. Documentation:
   - Each interface file has JSDoc comments explaining its purpose
   - Methods have clear signatures with domain types

## Subtasks

### 10.1. Create IProjectRepository interface in portfolio/entities/project/repositories/

**Status:** pending  
**Dependencies:** None  

Define the IProjectRepository interface with 8 methods (findAll, findPublished, findFeatured, findById, findBySlug, findRelated, save, delete) using domain types (Project entity, ProjectId and Slug VOs). No external library imports allowed.

**Details:**

Create file `packages/core/src/portfolio/entities/project/repositories/IProjectRepository.ts`. Import Project from '../model/Project', ProjectId from '../value-objects/ProjectId', and Slug from '../../../../shared/vo/Slug'. Define interface with methods: findAll(): Promise<Project[]>, findPublished(): Promise<Project[]>, findFeatured(): Promise<Project[]>, findById(id: ProjectId): Promise<Project | null>, findBySlug(slug: Slug): Promise<Project | null>, findRelated(id: ProjectId, limit?: number): Promise<Project[]>, save(project: Project): Promise<void>, delete(id: ProjectId): Promise<void>. Ensure all types are domain types - no primitives in method signatures.

### 10.2. Create IExperienceRepository and ISkillRepository interfaces

**Status:** pending  
**Dependencies:** None  

Define IExperienceRepository interface in portfolio/entities/experience/repositories/ and ISkillRepository interface in portfolio/entities/skill/repositories/, each with 4 CRUD methods using domain types.

**Details:**

Create `packages/core/src/portfolio/entities/experience/repositories/IExperienceRepository.ts` with methods: findAll(): Promise<Experience[]>, findById(id: Id): Promise<Experience | null>, save(experience: Experience): Promise<void>, delete(id: Id): Promise<void>. Import Experience from '../model/Experience' and Id from '../../../../shared/vo/Id'. Create `packages/core/src/portfolio/entities/skill/repositories/ISkillRepository.ts` with identical method signatures but using Skill entity. Import Skill from '../model/Skill' and Id from '../../../../shared/vo/Id'. Both interfaces follow standard repository pattern with async operations.

### 10.3. Create IProfileRepository interface with singleton pattern

**Status:** pending  
**Dependencies:** None  

Define IProfileRepository interface in portfolio/entities/profile/repositories/ with singleton pattern - only find() and save() methods (no findAll or delete).

**Details:**

Create `packages/core/src/portfolio/entities/profile/repositories/IProfileRepository.ts`. Import Profile from '../model/Profile' and Id from '../../../../shared/vo/Id'. Define interface with only 2 methods: find(): Promise<Profile | null> (returns single profile or null - singleton pattern), save(profile: Profile): Promise<void>. No findAll() method since Profile is a singleton entity. No delete() method as profile should always exist. This differs from standard CRUD repositories due to domain constraint of single profile per portfolio.

### 10.4. Update portfolio/index.ts to export all repository interfaces

**Status:** pending  
**Dependencies:** 10.1, 10.2  

Add exports for all four repository interfaces (IProjectRepository, IExperienceRepository, IProfileRepository, ISkillRepository) to the main portfolio package index file.

**Details:**

Edit `packages/core/src/portfolio/index.ts` to add repository interface exports. Add lines: export type { IProjectRepository } from './entities/project/repositories/IProjectRepository', export type { IExperienceRepository } from './entities/experience/repositories/IExperienceRepository', export type { IProfileRepository } from './entities/profile/repositories/IProfileRepository', export type { ISkillRepository } from './entities/skill/repositories/ISkillRepository'. Group with other repository-related exports if any exist. Maintain alphabetical ordering within export groups for consistency.

### 10.5. Validate architecture rules and TypeScript compilation

**Status:** pending  
**Dependencies:** 10.4  

Run comprehensive validation to ensure all repository interfaces follow Clean Architecture rules: no external imports, proper TypeScript compilation, correct exports, and adherence to domain-driven design principles.

**Details:**

Execute validation checks: (1) Run `pnpm types` in packages/core to verify TypeScript compilation with no errors. (2) Grep all repository files for prohibited imports: `grep -r "@prisma\|prisma\|supabase\|axios\|next" packages/core/src/portfolio/entities/*/repositories/` should return nothing. (3) Verify all interfaces use only domain types (entities and VOs) in method signatures - no string, number, or other primitives. (4) Confirm exports in portfolio/index.ts allow imports like `import type { IProjectRepository } from '@repo/core/portfolio'`. (5) Check directory structure matches: entities/<entity>/repositories/I<Entity>Repository.ts pattern. Document any violations and ensure all 4 interfaces comply with architectural constraints.
