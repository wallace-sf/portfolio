# Task ID: 8

**Title:** Update Project entity with complete Figma design fields

**Status:** pending

**Dependencies:** 6

**Priority:** high

**Description:** Extend Project entity with all fields required for Portfolio and Project Detail pages including slug, images, metadata, and relations

**Details:**

Update `packages/core/src/portfolio/entities/project/model/Project.ts`:

1. Create ProjectStatus enum in separate file:
```typescript
// packages/core/src/portfolio/entities/project/model/ProjectStatus.ts
export enum ProjectStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED'
}
```

2. Update IProjectProps interface:
```typescript
export interface IProjectProps extends IEntityProps {
  // Existing
  content: string;
  skills: ISkillProps[];
  
  // Updated to LocalizedText
  title: Record<string, string>;
  caption: Record<string, string>;
  
  // New fields
  slug: string;
  coverImage: { url: string; alt: Record<string, string> };
  theme: Record<string, string>;
  summary: Record<string, string>;
  objectives: Record<string, string>;
  role: Record<string, string>;
  team: string;
  period: { start: string; end?: string };
  featured: boolean;
  status: ProjectStatus;
  relatedProjects: string[];
}
```

3. Update Project class fields:
```typescript
export class Project extends Entity<Project, IProjectProps> {
  // Updated
  public readonly title: LocalizedText;
  public readonly caption: LocalizedText;
  
  // New
  public readonly slug: Slug;
  public readonly coverImage: Image;
  public readonly theme: LocalizedText;
  public readonly summary: LocalizedText;
  public readonly objectives: LocalizedText;
  public readonly role: LocalizedText;
  public readonly team: string;
  public readonly period: DateRange;
  public readonly featured: boolean;
  public readonly status: ProjectStatus;
  public readonly relatedProjects: Slug[];
  
  // Existing
  public readonly content: Text;
  public readonly skills: Skill[];

  private constructor(props: IProjectProps, domainObjects: {...}) {
    super(props);
    // Initialize all fields from domainObjects
  }

  static create(props: IProjectProps): Either<DomainError, Project> {
    // Validate all VOs and compose
    // Content validation with min 3 chars, max 500000 (or no upper limit)
    const contentResult = Text.create(props.content, { min: 3, max: 500000 });
    // ... other validations
    
    // Validate related projects slugs
    const relatedSlugs: Slug[] = [];
    for (const slugStr of props.relatedProjects) {
      const slugResult = Slug.create(slugStr);
      if (slugResult.isLeft()) return left(slugResult.value);
      relatedSlugs.push(slugResult.value);
    }
    
    return right(new Project(props, { /* all domain objects */ }));
  }
}
```

Update `ProjectBuilder` in `test/data/ProjectBuilder.ts` to support new fields.

**Test Strategy:**

Tests in `packages/core/test/portfolio/project/Project.test.ts`:

1. Valid project creation:
   - Create project with all fields → Right
   - Verify LocalizedText fields (title, caption, theme, summary, objectives, role)
   - Verify Slug, Image, DateRange, ProjectStatus

2. Validation rules:
   - Content min/max validation
   - Invalid slug → Left
   - Invalid cover image → Left
   - Invalid date range → Left
   - Invalid related project slug → Left

3. ProjectStatus enum:
   - Test each status value (DRAFT, PUBLISHED, ARCHIVED)

4. Update ProjectBuilder with factory methods for each status

5. Run full test suite: all tests must pass

## Subtasks

### 8.1. Create ProjectStatus enum in separate file

**Status:** pending  
**Dependencies:** None  

Create a new file for the ProjectStatus enum with DRAFT, PUBLISHED, and ARCHIVED values following TypeScript enum best practices

**Details:**

Create `packages/core/src/portfolio/entities/project/model/ProjectStatus.ts` with:
```typescript
export enum ProjectStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED'
}
```
Export from project model index file. Follow existing enum patterns in the codebase.

### 8.2. Update IProjectProps interface with new field signatures

**Status:** pending  
**Dependencies:** 8.1  

Extend IProjectProps interface to include all new fields (slug, coverImage, theme, summary, objectives, role, team, period, featured, status, relatedProjects) with correct types

**Details:**

Update `packages/core/src/portfolio/entities/project/model/Project.ts` IProjectProps interface:
- Add slug: string
- Add coverImage: { url: string; alt: Record<string, string> }
- Add theme, summary, objectives, role: Record<string, string> (LocalizedText raw format)
- Add team: string
- Add period: { start: string; end?: string }
- Add featured: boolean
- Add status: ProjectStatus
- Add relatedProjects: string[]
- Update title and caption to Record<string, string> format
- Keep existing content: string and skills: ISkillProps[]

### 8.3. Convert title and caption from Text to LocalizedText in Project class

**Status:** pending  
**Dependencies:** 8.2  

Update Project class fields to use LocalizedText VO instead of Text VO for title and caption fields, handling the breaking change appropriately

**Details:**

In Project class:
- Change `public readonly title: Text` to `public readonly title: LocalizedText`
- Change `public readonly caption: Text` to `public readonly caption: LocalizedText`
- Update constructor to accept LocalizedText instances
- Update create() method to call LocalizedText.create() instead of Text.create() for these fields
- Handle Either validation chaining for both fields

### 8.4. Add new primitive and VO fields to Project class (slug, coverImage, team, featured, status)

**Status:** pending  
**Dependencies:** 8.1, 8.2  

Implement new fields in Project class including Slug VO, Image VO, primitive fields (team, featured), and ProjectStatus enum field

**Details:**

Add to Project class:
- `public readonly slug: Slug` - validated in create()
- `public readonly coverImage: Image` - validated in create()
- `public readonly team: string` - no validation needed
- `public readonly featured: boolean` - primitive boolean
- `public readonly status: ProjectStatus` - enum value

Update constructor to initialize all fields from domainObjects parameter. Ensure proper Either validation chaining in create() method for Slug and Image VOs.

### 8.5. Add LocalizedText VO fields to Project class (theme, summary, objectives, role)

**Status:** pending  
**Dependencies:** None  

Implement four new LocalizedText value object fields in Project class with proper Either-based validation

**Details:**

Add to Project class:
- `public readonly theme: LocalizedText`
- `public readonly summary: LocalizedText`
- `public readonly objectives: LocalizedText`
- `public readonly role: LocalizedText`

In create() method, add Either validation for each:
```typescript
const themeResult = LocalizedText.create(props.theme);
if (themeResult.isLeft()) return left(themeResult.value);
```
Repeat for summary, objectives, and role. Pass validated instances to constructor via domainObjects.

### 8.6. Add DateRange VO field (period) to Project class

**Status:** pending  
**Dependencies:** 8.2  

Implement the period field using DateRange value object with start and optional end date validation

**Details:**

Add to Project class:
- `public readonly period: DateRange`

In create() method:
```typescript
const periodResult = DateRange.create({
  start: props.period.start,
  end: props.period.end
});
if (periodResult.isLeft()) return left(periodResult.value);
```

Handle optional end date properly. Pass validated DateRange instance to constructor.

### 8.7. Implement relatedProjects array validation with Slug VOs

**Status:** pending  
**Dependencies:** 8.4  

Add relatedProjects field as array of Slug VOs with indexed error handling similar to SkillFactory.bulk() pattern

**Details:**

Add to Project class:
- `public readonly relatedProjects: Slug[]`

In create() method:
```typescript
const relatedSlugs: Slug[] = [];
for (const slugStr of props.relatedProjects) {
  const slugResult = Slug.create(slugStr);
  if (slugResult.isLeft()) return left(slugResult.value);
  relatedSlugs.push(slugResult.value);
}
```

Consider adding index to error message for clarity. Handle empty array case (valid).

### 8.8. Update content validation with new constraints (min 3, max 500000)

**Status:** pending  
**Dependencies:** 8.2  

Modify content field validation to use new minimum 3 characters and maximum 500000 characters constraints, or remove upper limit entirely

**Details:**

Update content validation in create() method:
```typescript
const contentResult = Text.create(props.content, { 
  min: 3, 
  max: 500000 // or remove max entirely if no upper limit needed
});
if (contentResult.isLeft()) return left(contentResult.value);
```

Decide on final max value based on requirements. Current is 12500, new requirement is 500000 or unlimited. Document the chosen constraint.

### 8.9. Update ProjectBuilder with all new fields and status factory methods

**Status:** pending  
**Dependencies:** 8.1, 8.2, 8.4, 8.5, 8.6, 8.8  

Extend ProjectBuilder test helper to support all new fields and add factory methods for each ProjectStatus (draft, published, archived)

**Details:**

Update `packages/core/test/data/ProjectBuilder.ts`:
- Add builder methods for: slug, coverImage, theme, summary, objectives, role, team, period, featured, status, relatedProjects
- Add factory methods: `ProjectBuilder.draft()`, `ProjectBuilder.published()`, `ProjectBuilder.archived()`
- Update default values to include all new required fields
- Ensure builder supports fluent API for all fields
- Update existing tests to use new builder methods
