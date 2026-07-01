# Task ID: 6

**Title:** Migrate all Entities to Either pattern and reorganize structure

**Status:** pending

**Dependencies:** 5

**Priority:** high

**Description:** Refactor entity factory methods to return Either, make constructors private, and reorganize directories to match CLAUDE.md conventions

**Details:**

For each entity (Project, Experience, Skill, Language, ProfessionalValue, SocialNetwork):

1. Make constructor private
2. Add `static create()` returning `Either<DomainError, Entity>`
3. Move entities to `src/portfolio/entities/<name>/model/<Name>.ts` structure
4. Update `SkillFactory.bulk()` to return `Either<DomainError, Skill[]>` with index in error messages

Example for Skill entity:
```typescript
export class Skill extends Entity<Skill, ISkillProps> {
  private constructor(props: ISkillProps) {
    super(props);
    // Initialize fields
  }

  static create(props: ISkillProps): Either<DomainError, Skill> {
    const nameResult = Name.create(props.name);
    if (nameResult.isLeft()) return left(nameResult.value);
    
    const typeResult = SkillType.create(props.type);
    if (typeResult.isLeft()) return left(typeResult.value);
    
    return right(new Skill({
      ...props,
      name: nameResult.value,
      type: typeResult.value
    }));
  }
}
```

For SkillFactory.bulk():
```typescript
static bulk(skillsProps: ISkillProps[]): Either<DomainError, Skill[]> {
  const skills: Skill[] = [];
  
  for (let i = 0; i < skillsProps.length; i++) {
    const result = Skill.create(skillsProps[i]);
    if (result.isLeft()) {
      return left(new ValidationError({
        code: 'INVALID_SKILL_AT_INDEX',
        message: `Invalid skill at index ${i}: ${result.value.message}`,
        details: { index: i, error: result.value }
      }));
    }
    skills.push(result.value);
  }
  
  return right(skills);
}
```

Directory reorganization:
- Move `src/project/model/Project.ts` → `src/portfolio/entities/project/model/Project.ts`
- Move `src/skill/model/Skill.ts` → `src/portfolio/entities/skill/model/Skill.ts`
- Move `src/experience/Experience.ts` → `src/portfolio/entities/experience/model/Experience.ts`
- Update all imports and re-exports in `src/portfolio/index.ts`

**Test Strategy:**

For each entity:
- Update test builders to handle Either return values
- Test `create()` with valid props returns Right
- Test `create()` with invalid props returns Left with appropriate error
- Test `SkillFactory.bulk()` with all valid skills returns Right
- Test `SkillFactory.bulk()` with one invalid skill returns Left with index
- Verify all existing entity tests pass after migration
- Run `pnpm test` and verify 100% pass rate

## Subtasks

### 6.1. Refactor Project entity to Either pattern and relocate to portfolio/entities/project/model/

**Status:** pending  
**Dependencies:** None  

Make Project constructor private, add static create() method returning Either<DomainError, Project>, handle all composed VOs with Either pattern, and move file from src/project/model/Project.ts to src/portfolio/entities/project/model/Project.ts

**Details:**

1. Make Project constructor private
2. Create static create(props: IProjectProps): Either<DomainError, Project>
3. Chain Either validations for all VOs (Markdown for content, Skill array, etc.)
4. Handle array validation: map over skills, collect Left errors if any
5. Move file from packages/core/src/project/model/Project.ts to packages/core/src/portfolio/entities/project/model/Project.ts
6. Update internal imports within the file
7. Ensure all error returns use left() and success returns use right()
8. Preserve all existing business logic and field assignments

### 6.2. Refactor Experience entity to Either pattern and relocate to portfolio/entities/experience/model/

**Status:** pending  
**Dependencies:** 6.1  

Make Experience constructor private, add static create() method returning Either<DomainError, Experience>, handle all composed VOs with Either pattern, and move file from src/experience/Experience.ts to src/portfolio/entities/experience/model/Experience.ts

**Details:**

1. Make Experience constructor private (currently public at line 38)
2. Create static create(props: IExperienceProps): Either<DomainError, Experience>
3. Chain Either validations for: Name (company), LocalizedText (role, description), DateRange (period), EmploymentType, LocationType, Url (companyUrl)
4. Handle nested objects: Location with city/country, employment metadata
5. Move from packages/core/src/experience/Experience.ts to packages/core/src/portfolio/entities/experience/model/Experience.ts
6. Update imports for VOs and base Entity class
7. Return left() for validation failures, right() for success

### 6.3. Refactor Skill entity to Either pattern and relocate to portfolio/entities/skill/model/

**Status:** pending  
**Dependencies:** 6.1  

Make Skill constructor private, add static create() method returning Either<DomainError, Skill>, handle Name and SkillType VOs with Either pattern, and move file from src/skill/model/Skill.ts to src/portfolio/entities/skill/model/Skill.ts

**Details:**

1. Make Skill constructor private (currently public at line 20)
2. Create static create(props: ISkillProps): Either<DomainError, Skill>
3. Validate Name VO: const nameResult = Name.create(props.name); if (nameResult.isLeft()) return left(nameResult.value)
4. Validate SkillType VO: const typeResult = SkillType.create(props.type); if (typeResult.isLeft()) return left(typeResult.value)
5. Move from packages/core/src/skill/model/Skill.ts to packages/core/src/portfolio/entities/skill/model/Skill.ts
6. Return right(new Skill({ ...props, name: nameResult.value, type: typeResult.value }))
7. Update imports for path changes

### 6.4. Refactor Language entity to Either pattern and relocate to portfolio/entities/language/model/

**Status:** pending  
**Dependencies:** 6.1  

Make Language constructor private, add static create() method returning Either<DomainError, Language>, handle Name and Fluency VOs with Either pattern, and move file to src/portfolio/entities/language/model/Language.ts

**Details:**

1. Locate current Language entity file
2. Make constructor private
3. Create static create(props: ILanguageProps): Either<DomainError, Language>
4. Validate Name VO for language name with Either pattern
5. Validate Fluency VO with Either pattern
6. Create new directory structure: packages/core/src/portfolio/entities/language/model/
7. Move Language.ts to new location
8. Chain Either validations: check Name first, then Fluency
9. Return left() on any validation failure, right(new Language(...)) on success
10. Update all import paths

### 6.5. Refactor ProfessionalValue entity to Either pattern and relocate to portfolio/entities/professional-value/model/

**Status:** pending  
**Dependencies:** 6.1  

Make ProfessionalValue constructor private, add static create() method returning Either<DomainError, ProfessionalValue>, handle composed VOs with Either pattern, and move file to src/portfolio/entities/professional-value/model/ProfessionalValue.ts

**Details:**

1. Locate current ProfessionalValue entity file
2. Make constructor private
3. Create static create(props: IProfessionalValueProps): Either<DomainError, ProfessionalValue>
4. Identify all composed VOs in ProfessionalValue (likely Name, LocalizedText for description)
5. Chain Either validations for each VO
6. Create directory: packages/core/src/portfolio/entities/professional-value/model/
7. Move file to new location
8. Update import paths for VOs and base classes
9. Ensure error propagation: if any VO validation fails, return left() immediately
10. Return right(new ProfessionalValue(...)) on success

### 6.6. Refactor SocialNetwork entity to Either pattern and relocate to portfolio/entities/social-network/model/

**Status:** pending  
**Dependencies:** 6.1  

Make SocialNetwork constructor private, add static create() method returning Either<DomainError, SocialNetwork>, handle Name and Url VOs with Either pattern, and move file to src/portfolio/entities/social-network/model/SocialNetwork.ts

**Details:**

1. Locate current SocialNetwork entity file
2. Make constructor private
3. Create static create(props: ISocialNetworkProps): Either<DomainError, SocialNetwork>
4. Validate Name VO for platform name: const nameResult = Name.create(props.name)
5. Validate Url VO for profile URL: const urlResult = Url.create(props.url)
6. Chain validations: if (nameResult.isLeft()) return left(nameResult.value); if (urlResult.isLeft()) return left(urlResult.value)
7. Create directory: packages/core/src/portfolio/entities/social-network/model/
8. Move SocialNetwork.ts to new location
9. Update imports for new paths
10. Return right(new SocialNetwork({ name: nameResult.value, url: urlResult.value }))

### 6.7. Update SkillFactory.bulk() to return Either with indexed error messages

**Status:** pending  
**Dependencies:** None  

Refactor SkillFactory.bulk() method from returning Skill[] to returning Either<DomainError, Skill[]>, iterate over skill props array, and include index in error messages for failed validations

**Details:**

1. Locate SkillFactory.bulk() method (currently at line 4-6)
2. Change return type from Skill[] to Either<DomainError, Skill[]>
3. Initialize empty array: const skills: Skill[] = []
4. Loop with index: for (let i = 0; i < skillsProps.length; i++)
5. Call Skill.create(skillsProps[i]) for each item
6. Check if result.isLeft(): return left(new ValidationError({ code: 'INVALID_SKILL_AT_INDEX', message: `Invalid skill at index ${i}: ${result.value.message}`, details: { index: i, error: result.value } }))
7. If result.isRight(): skills.push(result.value)
8. After loop completes: return right(skills)
9. Update any callers of bulk() to handle Either return type

### 6.8. Reorganize directory structure and update all imports/exports across packages

**Status:** pending  
**Dependencies:** 6.2, 6.4, 6.5, 6.6  

Update all import statements throughout packages/core to reflect new entity locations, update src/portfolio/index.ts exports, and verify package.json exports configuration matches new structure

**Details:**

1. Update packages/core/src/portfolio/index.ts to export from new entity locations:
   - export * from './entities/project/model/Project'
   - export * from './entities/experience/model/Experience'
   - export * from './entities/skill/model/Skill'
   - export * from './entities/language/model/Language'
   - export * from './entities/professional-value/model/ProfessionalValue'
   - export * from './entities/social-network/model/SocialNetwork'
2. Find all files importing entities (use grep/search)
3. Update import paths from old locations to new locations
4. Verify packages/core/package.json exports field includes './portfolio': './src/portfolio/index.ts'
5. Check for circular dependencies after reorganization
6. Update any builders, factories, or test utilities with new import paths

### 6.9. Update all entity test builders to handle Either returns

**Status:** pending  
**Dependencies:** 6.8  

Refactor ProjectBuilder, ExperienceBuilder, SkillBuilder, LanguageBuilder, ProfessionalValueBuilder, and SocialNetworkBuilder to unwrap Either values and throw on Left for test convenience

**Details:**

1. Locate all test builder files (e.g., ProjectBuilder.ts, ExperienceBuilder.ts, etc.)
2. For each builder's build() method:
   - Call Entity.create() which now returns Either
   - Unwrap result: const result = Entity.create(props); if (result.isLeft()) throw new Error(`Builder failed: ${result.value.message}`)
   - Return result.value (the Right side)
3. Update SkillBuilder to handle SkillFactory.bulk() Either return
4. Ensure builders still provide fluent API for test setup
5. Update any builder methods that internally create VOs to handle Either returns
6. Verify builders throw descriptive errors when invalid props provided
7. Check if builders are used in test setup and update accordingly

### 6.10. Comprehensive testing ensuring all 6 entities work with Either pattern and directory reorganization

**Status:** pending  
**Dependencies:** 6.9  

Run full test suite, verify all entity tests pass with Either pattern, ensure no import errors from directory reorganization, and validate that all entity creation flows handle Left/Right cases correctly

**Details:**

1. Run pnpm test in packages/core to execute all tests
2. Verify all entity tests pass (Project, Experience, Skill, Language, ProfessionalValue, SocialNetwork)
3. Check coverage reports to ensure Either pattern branches (isLeft/isRight) are covered
4. Test entity creation with valid props returns Right for all 6 entities
5. Test entity creation with invalid props returns Left with correct error codes for all 6 entities
6. Verify SkillFactory.bulk() tests pass with indexed error messages
7. Run pnpm build to verify TypeScript compilation succeeds
8. Test importing entities from other packages (@repo/core/portfolio) works
9. Verify no circular dependencies were introduced
10. Check that all test builders work correctly with Either unwrapping
11. Run pnpm typecheck to ensure no type errors across monorepo
