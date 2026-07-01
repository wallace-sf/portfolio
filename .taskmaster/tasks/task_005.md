# Task ID: 5

**Title:** Create missing Value Objects: Slug, Image, DateRange

**Status:** pending

**Dependencies:** 4

**Priority:** high

**Description:** Implement three new VOs required by the domain model with Either-based validation

**Details:**

1. Create `packages/core/src/shared/vo/Slug.ts`:
```typescript
import { Either, left, right } from '../either';
import { ValidationError } from '../errors';
import { ValueObject } from '../base/ValueObject';

export class Slug extends ValueObject<string> {
  private static readonly SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  
  private constructor(value: string) {
    super({ value });
  }

  static create(raw: string): Either<ValidationError, Slug> {
    if (!raw?.trim() || raw.length < 3) {
      return left(new ValidationError({
        code: 'INVALID_SLUG',
        message: 'Slug must be at least 3 characters'
      }));
    }
    
    const normalized = raw.toLowerCase().trim();
    
    if (!this.SLUG_REGEX.test(normalized)) {
      return left(new ValidationError({
        code: 'INVALID_SLUG',
        message: 'Slug must be kebab-case (lowercase letters, numbers, hyphens only)'
      }));
    }
    
    return right(new Slug(normalized));
  }

  toPath(): string {
    return `/${this.value}`;
  }
}
```

2. Create `packages/core/src/shared/vo/Image.ts` composing Url and LocalizedText:
```typescript
export class Image extends ValueObject<{ url: Url; alt: LocalizedText }> {
  private constructor(url: Url, alt: LocalizedText) {
    super({ value: { url, alt } });
  }

  static create(urlStr: string, alt: Record<string, string>): Either<ValidationError, Image> {
    const urlResult = Url.create(urlStr);
    if (urlResult.isLeft()) return left(urlResult.value);
    
    const altResult = LocalizedText.create(alt);
    if (altResult.isLeft()) return left(altResult.value);
    
    return right(new Image(urlResult.value, altResult.value));
  }

  get url(): Url { return this.value.url; }
  get alt(): LocalizedText { return this.value.alt; }
}
```

3. Create `packages/core/src/shared/vo/DateRange.ts`:
```typescript
export class DateRange extends ValueObject<{ startAt: DateTime; endAt?: DateTime }> {
  private constructor(startAt: DateTime, endAt?: DateTime) {
    super({ value: { startAt, endAt } });
  }

  static create(start: string, end?: string): Either<ValidationError, DateRange> {
    const startResult = DateTime.create(start);
    if (startResult.isLeft()) return left(startResult.value);
    
    let endAt: DateTime | undefined;
    if (end) {
      const endResult = DateTime.create(end);
      if (endResult.isLeft()) return left(endResult.value);
      endAt = endResult.value;
      
      if (startResult.value.ms > endAt.ms) {
        return left(new ValidationError({
          code: 'INVALID_DATE_RANGE',
          message: 'Start date must be before or equal to end date'
        }));
      }
    }
    
    return right(new DateRange(startResult.value, endAt));
  }

  isActive(): boolean {
    return this.value.endAt === undefined;
  }
  
  get startAt(): DateTime { return this.value.startAt; }
  get endAt(): DateTime | undefined { return this.value.endAt; }
}
```

4. Update `packages/core/src/shared/vo/index.ts` to export all three

5. Create test data providers in `packages/core/test/data/bases/`

**Test Strategy:**

For each VO:

**Slug tests** (`test/shared/vo/Slug.test.ts`):
- Valid kebab-case slugs return Right
- Invalid formats (uppercase, spaces, special chars) return Left with INVALID_SLUG
- Min length validation (< 3 chars) returns Left
- `toPath()` returns '/slug-name'

**Image tests** (`test/shared/vo/Image.test.ts`):
- Valid URL and alt text return Right
- Invalid URL returns Left
- Invalid alt text (missing locale) returns Left
- Getter methods return correct Url and LocalizedText instances

**DateRange tests** (`test/shared/vo/DateRange.test.ts`):
- Valid start/end dates return Right
- Start > end returns Left with INVALID_DATE_RANGE
- No end date (ongoing) returns Right
- `isActive()` returns true when endAt is undefined
- `isActive()` returns false when endAt is defined

Create data providers: `SlugData.ts`, `ImageData.ts` in test/data/bases/

## Subtasks

### 5.1. Implement Slug Value Object with kebab-case validation

**Status:** pending  
**Dependencies:** None  

Create the Slug VO in packages/core/src/shared/vo/Slug.ts with regex-based validation for kebab-case format, minimum length checks, and toPath() method

**Details:**

Implement Slug.ts extending ValueObject<string> with:
- Private static SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/ for kebab-case validation
- Private constructor taking normalized string value
- Static create(raw: string) method with Either<ValidationError, Slug> return:
  - Validate min 3 characters (return Left with INVALID_SLUG if violated)
  - Normalize to lowercase and trim
  - Test against SLUG_REGEX (return Left with INVALID_SLUG if fails)
  - Return Right(new Slug(normalized)) on success
- Public toPath(): string method returning `/${this.value}`
- Import Either, left, right from '../either'
- Import ValidationError from '../errors'
- Import ValueObject from '../base/ValueObject'

### 5.2. Implement Image Value Object composing Url and LocalizedText

**Status:** pending  
**Dependencies:** 5.1  

Create the Image VO in packages/core/src/shared/vo/Image.ts as a composite value object that combines Url and LocalizedText with proper Either chaining

**Details:**

Implement Image.ts extending ValueObject<{ url: Url; alt: LocalizedText }> with:
- Private constructor taking url: Url and alt: LocalizedText parameters
- Static create(urlStr: string, alt: Record<string, string>) method:
  - Call Url.create(urlStr) and check if Left, return early with error
  - Call LocalizedText.create(alt) and check if Left, return early with error
  - Return Right(new Image(urlResult.value, altResult.value)) on success
- Getter methods: get url(): Url and get alt(): LocalizedText
- Properly handle Either composition from multiple VOs
- Import Url and LocalizedText from their respective files
- Import Either, left, right from '../either'
- Import ValidationError from '../errors'
- Import ValueObject from '../base/ValueObject'

### 5.3. Implement DateRange Value Object with start/end validation

**Status:** pending  
**Dependencies:** 5.2  

Create the DateRange VO in packages/core/src/shared/vo/DateRange.ts with DateTime composition, start-before-end validation, and isActive() business logic

**Details:**

Implement DateRange.ts extending ValueObject<{ startAt: DateTime; endAt?: DateTime }> with:
- Private constructor taking startAt: DateTime and optional endAt?: DateTime
- Static create(start: string, end?: string) method:
  - Call DateTime.create(start), return Left if invalid
  - If end provided, call DateTime.create(end), return Left if invalid
  - Validate startAt.ms <= endAt.ms, return Left with INVALID_DATE_RANGE if violated
  - Return Right(new DateRange(startResult.value, endAt)) on success
- Public isActive(): boolean method returning true if endAt is undefined
- Getter methods: get startAt(): DateTime and get endAt(): DateTime | undefined
- Import DateTime from './DateTime'
- Import Either, left, right from '../either'
- Import ValidationError from '../errors'
- Import ValueObject from '../base/ValueObject'

### 5.4. Create comprehensive unit tests for Slug VO

**Status:** pending  
**Dependencies:** 5.1  

Write unit tests in packages/core/test/shared/vo/Slug.test.ts covering all validation rules, edge cases, and the toPath() method

**Details:**

Create Slug.test.ts with describe block testing:
- Valid kebab-case slugs ('my-slug', 'slug-123', 'abc') return Right
- Invalid formats return Left with INVALID_SLUG:
  - Uppercase letters ('My-Slug')
  - Spaces ('my slug')
  - Special characters ('my_slug', 'my.slug', 'my@slug')
  - Leading/trailing hyphens ('-slug', 'slug-')
  - Consecutive hyphens ('my--slug')
- Min length validation:
  - Strings < 3 chars ('ab', 'a') return Left
  - Empty string and whitespace-only return Left
- toPath() method returns '/slug-name' format
- Edge cases: trim whitespace before validation
- Use Vitest (describe, it, expect) with proper assertions
- Test both isLeft() and isRight() type guards

### 5.5. Create comprehensive unit tests for Image VO

**Status:** pending  
**Dependencies:** 5.2  

Write unit tests in packages/core/test/shared/vo/Image.test.ts covering composition of Url and LocalizedText with proper error handling

**Details:**

Create Image.test.ts with describe block testing:
- Valid composition: valid URL + valid LocalizedText returns Right
- Invalid URL composition:
  - Invalid URL string returns Left with Url's validation error
  - Verify error is propagated from Url.create()
- Invalid LocalizedText composition:
  - Invalid localized text returns Left with LocalizedText's validation error
  - Empty translations, missing required locales
- Getter methods:
  - image.url returns Url instance
  - image.alt returns LocalizedText instance
- Either chaining: verify both VOs are validated in sequence
- Test with mock data for URLs and localized alt text
- Use Vitest (describe, it, expect) with proper assertions
- Verify Left returns contain appropriate ValidationError from composed VOs

### 5.6. Create comprehensive unit tests for DateRange VO and test data providers

**Status:** pending  
**Dependencies:** 5.4, 5.5  

Write unit tests in packages/core/test/shared/vo/DateRange.test.ts covering start/end validation and business logic, plus create test data providers for all three VOs

**Details:**

Create DateRange.test.ts with describe block testing:
- Valid range: start <= end returns Right
- Invalid range: start > end returns Left with INVALID_DATE_RANGE
- Optional end date: omitting end date returns Right
- isActive() method:
  - Returns true when endAt is undefined (ongoing period)
  - Returns false when endAt is defined (completed period)
- Getter methods: startAt and endAt return correct DateTime instances
- Edge cases: same start and end date (valid), invalid DateTime strings

Create test data providers in packages/core/test/data/bases/:
- SlugData.ts: valid slugs ('my-project', 'test-123'), invalid slugs ('My-Project', 'test_case')
- ImageData.ts: valid Image objects with URLs and localized alt text
- DateRangeData.ts: valid ranges, invalid ranges, active/inactive periods

Use Vitest with proper assertions for all tests
