# Task ID: 7

**Title:** Create Profile entity with featured projects invariant

**Status:** pending

**Dependencies:** 6

**Priority:** high

**Description:** Implement the Profile entity representing personal portfolio data with business rule: maximum 6 featured projects

**Details:**

Create `packages/core/src/portfolio/entities/profile/model/Profile.ts`:

```typescript
import { Entity, IEntityProps } from '../../../../shared/base/Entity';
import { Name, LocalizedText, Image, Slug } from '../../../../shared/vo';
import { Either, left, right } from '../../../../shared/either';
import { ValidationError } from '../../../../shared/errors';
import { ProfileStat } from './ProfileStat';

export interface IProfileProps extends IEntityProps {
  name: string;
  headline: Record<string, string>;
  bio: Record<string, string>;
  photo: { url: string; alt: Record<string, string> };
  stats: Array<{ label: Record<string, string>; value: string; icon: string }>;
  featuredProjectSlugs: string[];
}

export class Profile extends Entity<Profile, IProfileProps> {
  private static readonly MAX_FEATURED_PROJECTS = 6;
  
  public readonly name: Name;
  public readonly headline: LocalizedText;
  public readonly bio: LocalizedText;
  public readonly photo: Image;
  public readonly stats: ProfileStat[];
  public readonly featuredProjectSlugs: Slug[];

  private constructor(props: IProfileProps, domainObjects: {
    name: Name;
    headline: LocalizedText;
    bio: LocalizedText;
    photo: Image;
    stats: ProfileStat[];
    featuredProjectSlugs: Slug[];
  }) {
    super(props);
    this.name = domainObjects.name;
    this.headline = domainObjects.headline;
    this.bio = domainObjects.bio;
    this.photo = domainObjects.photo;
    this.stats = domainObjects.stats;
    this.featuredProjectSlugs = domainObjects.featuredProjectSlugs;
  }

  static create(props: IProfileProps): Either<ValidationError, Profile> {
    // Validate featured projects invariant
    if (props.featuredProjectSlugs.length > this.MAX_FEATURED_PROJECTS) {
      return left(new ValidationError({
        code: 'TOO_MANY_FEATURED_PROJECTS',
        message: `Maximum ${this.MAX_FEATURED_PROJECTS} featured projects allowed, got ${props.featuredProjectSlugs.length}`
      }));
    }

    // Validate and create VOs
    const nameResult = Name.create(props.name);
    if (nameResult.isLeft()) return left(nameResult.value);

    const headlineResult = LocalizedText.create(props.headline);
    if (headlineResult.isLeft()) return left(headlineResult.value);

    const bioResult = LocalizedText.create(props.bio);
    if (bioResult.isLeft()) return left(bioResult.value);

    const photoResult = Image.create(props.photo.url, props.photo.alt);
    if (photoResult.isLeft()) return left(photoResult.value);

    // Create stats
    const stats: ProfileStat[] = [];
    for (const statProps of props.stats) {
      const statResult = ProfileStat.create(statProps);
      if (statResult.isLeft()) return left(statResult.value);
      stats.push(statResult.value);
    }

    // Create featured project slugs
    const slugs: Slug[] = [];
    for (const slugStr of props.featuredProjectSlugs) {
      const slugResult = Slug.create(slugStr);
      if (slugResult.isLeft()) return left(slugResult.value);
      slugs.push(slugResult.value);
    }

    return right(new Profile(props, {
      name: nameResult.value,
      headline: headlineResult.value,
      bio: bioResult.value,
      photo: photoResult.value,
      stats,
      featuredProjectSlugs: slugs
    }));
  }
}
```

Create `packages/core/src/portfolio/entities/profile/model/ProfileStat.ts`:
```typescript
export interface IProfileStatProps {
  label: Record<string, string>;
  value: string;
  icon: string;
}

export class ProfileStat {
  public readonly label: LocalizedText;
  public readonly value: string;
  public readonly icon: Text;

  private constructor(label: LocalizedText, value: string, icon: Text) {
    this.label = label;
    this.value = value;
    this.icon = icon;
  }

  static create(props: IProfileStatProps): Either<ValidationError, ProfileStat> {
    const labelResult = LocalizedText.create(props.label);
    if (labelResult.isLeft()) return left(labelResult.value);

    const iconResult = Text.create(props.icon);
    if (iconResult.isLeft()) return left(iconResult.value);

    return right(new ProfileStat(labelResult.value, props.value, iconResult.value));
  }
}
```

Update `packages/core/src/portfolio/index.ts` to export Profile and ProfileStat.

**Test Strategy:**

Tests in `packages/core/test/portfolio/profile/Profile.test.ts`:

1. Valid profile creation:
   - Create profile with 6 featured projects → Right
   - Verify all fields are correctly initialized

2. Invariant violation:
   - Create profile with 7 featured projects → Left with TOO_MANY_FEATURED_PROJECTS
   - Create profile with 0 featured projects → Right

3. Validation cascading:
   - Invalid name → Left
   - Invalid slug in featuredProjectSlugs → Left
   - Invalid stat → Left

4. Create `ProfileBuilder` in `test/data/ProfileBuilder.ts` for test data

5. Run full test suite: all tests must pass

## Subtasks

### 7.1. Create ProfileStat Value Object with LocalizedText composition

**Status:** pending  
**Dependencies:** None  

Implement ProfileStat.ts as a Value Object that composes LocalizedText for label, string for value, and Text VO for icon field with Either-based validation

**Details:**

Create `packages/core/src/portfolio/entities/profile/model/ProfileStat.ts` with IProfileStatProps interface (label: Record<string, string>, value: string, icon: string). Implement private constructor accepting validated LocalizedText, string, and Text instances. Implement static create() method that validates label using LocalizedText.create(), icon using Text.create(), and returns Either<ValidationError, ProfileStat>. Chain Either results using early returns on isLeft(). Import required VOs from shared/vo and Either/ValidationError from shared. Follow ValueObject composition pattern from existing codebase.

### 7.2. Create Profile entity skeleton with IProfileProps interface

**Status:** pending  
**Dependencies:** 7.1  

Set up Profile entity class structure with private constructor, readonly properties, and IProfileProps interface extending IEntityProps

**Details:**

Create `packages/core/src/portfolio/entities/profile/model/Profile.ts`. Define IProfileProps interface extending IEntityProps with: name (string), headline (Record<string, string>), bio (Record<string, string>), photo ({ url: string, alt: Record<string, string> }), stats (Array<{ label: Record<string, string>, value: string, icon: string }>), featuredProjectSlugs (string[]). Create Profile class extending Entity<Profile, IProfileProps>. Add private static readonly MAX_FEATURED_PROJECTS = 6. Declare readonly properties: name (Name), headline (LocalizedText), bio (LocalizedText), photo (Image), stats (ProfileStat[]), featuredProjectSlugs (Slug[]). Implement private constructor accepting props and domainObjects parameter containing all validated VO instances.

### 7.3. Implement featured projects invariant validation in Profile.create()

**Status:** pending  
**Dependencies:** 7.2  

Add business rule validation to Profile.create() enforcing maximum 6 featured projects with proper error handling

**Details:**

In Profile.create() static method, add first validation check: if (props.featuredProjectSlugs.length > this.MAX_FEATURED_PROJECTS) return left(new ValidationError({ code: 'TOO_MANY_FEATURED_PROJECTS', message: `Maximum ${this.MAX_FEATURED_PROJECTS} featured projects allowed, got ${props.featuredProjectSlugs.length}` })). Place this check at the beginning of create() method before any VO validations. This enforces the core business invariant that Profile aggregate must protect. Import ValidationError from shared/errors and Either/left/right from shared/either.

### 7.4. Implement Name, LocalizedText, and Image VO validation in Profile.create()

**Status:** pending  
**Dependencies:** None  

Add Either-based validation for name, headline, bio, and photo fields in Profile.create() method with proper error propagation

**Details:**

In Profile.create(), after invariant check, validate each VO: (1) const nameResult = Name.create(props.name); if (nameResult.isLeft()) return left(nameResult.value), (2) const headlineResult = LocalizedText.create(props.headline); if (headlineResult.isLeft()) return left(headlineResult.value), (3) const bioResult = LocalizedText.create(props.bio); if (bioResult.isLeft()) return left(bioResult.value), (4) const photoResult = Image.create(props.photo.url, props.photo.alt); if (photoResult.isLeft()) return left(photoResult.value). Import Name, LocalizedText, Image from ../../../../shared/vo. Use early return pattern for Each validation failure.

### 7.5. Implement stats array validation with ProfileStat creation

**Status:** pending  
**Dependencies:** 7.4  

Validate and transform props.stats array into ProfileStat[] with indexed error messages for debugging

**Details:**

In Profile.create(), after single VO validations, add: const stats: ProfileStat[] = []; for (const statProps of props.stats) { const statResult = ProfileStat.create(statProps); if (statResult.isLeft()) return left(statResult.value); stats.push(statResult.value); }. Consider enhancing error messages with array index for debugging: return left(new ValidationError({ code: statResult.value.code, message: `Stat at index ${stats.length}: ${statResult.value.message}` })). This provides clear feedback when one stat in the array fails validation.

### 7.6. Implement featuredProjectSlugs array validation and Profile instantiation

**Status:** pending  
**Dependencies:** 7.5  

Validate featuredProjectSlugs array converting strings to Slug VOs and complete Profile.create() by returning Right with new Profile instance

**Details:**

In Profile.create(), after stats validation, add: const slugs: Slug[] = []; for (const slugStr of props.featuredProjectSlugs) { const slugResult = Slug.create(slugStr); if (slugResult.isLeft()) return left(slugResult.value); slugs.push(slugResult.value); }. Then complete method with: return right(new Profile(props, { name: nameResult.value, headline: headlineResult.value, bio: bioResult.value, photo: photoResult.value, stats, featuredProjectSlugs: slugs })); Import Slug from shared/vo. Consider adding indexed error messages similar to stats array.

### 7.7. Create comprehensive Profile tests and ProfileBuilder utility

**Status:** pending  
**Dependencies:** 7.6  

Write full test suite for Profile entity covering all validation paths and create ProfileBuilder test utility for fixtures

**Details:**

Create `packages/core/test/portfolio/profile/Profile.test.ts` with test suites: (1) 'Profile.create() - valid creation' testing all happy paths with 0-6 featured projects, (2) 'Profile.create() - invariant violations' testing >6 featured projects error, (3) 'Profile.create() - VO validation failures' testing each field's failure path (name, headline, bio, photo, stats, slugs), (4) 'Profile.create() - array validations' testing stats and slugs array edge cases. Create `packages/core/test/data/ProfileBuilder.ts` with fluent builder: ProfileBuilder.aProfile().withName('John').withFeaturedProjects(['proj-1']).build() returning IProfileProps for easy test fixture creation. Export from packages/core/src/portfolio/index.ts: export { Profile, ProfileStat } from './entities/profile/model';
