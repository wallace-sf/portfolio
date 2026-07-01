# Task ID: 4

**Title:** Migrate all Value Objects to Either pattern

**Status:** pending

**Dependencies:** 3

**Priority:** high

**Description:** Refactor all VOs (Id, DateTime, Text, Name, Url, EmploymentType, Fluency, LocationType, SkillType, LocalizedText) from throw-based to Either-based error handling

**Details:**

For each VO in `packages/core/src/shared/vo/`:

1. Change static factory method to return `Either<ValidationError, T>`:
```typescript
static create(value: string): Either<ValidationError, VoName> {
  const validation = Validator.new(value)
    .required('Value is required')
    .min(3, 'Minimum 3 characters')
    .validate();
  
  if (!validation.isValid && validation.error) {
    return left(new ValidationError({ 
      code: 'INVALID_VO_NAME',
      message: validation.error 
    }));
  }
  
  return right(new VoName(value));
}
```

2. For Id VO:
   - Create `Id.generate()` that returns `Id` directly (no Either) for generating new UUIDs
   - Keep `Id.create(value)` returning `Either<ValidationError, Id>` for validation

3. Remove all `throw` statements for domain errors

4. Standardize error codes to `INVALID_<NAME>` format (e.g., `INVALID_ID`, `INVALID_TEXT`)

5. Translate all Portuguese error messages to English

6. Delete `packages/core/src/shared/i18n/ERROR_MESSAGE.ts` (no longer needed)

7. Update exports in `packages/core/src/shared/vo/index.ts`

VOs to migrate:
- Id
- DateTime
- Text
- Name
- Url
- EmploymentType
- Fluency
- LocationType
- SkillType
- LocalizedText

**Test Strategy:**

For each VO:
- Rewrite tests to use Either pattern (no `.toThrow()` assertions)
- Test happy path: `expect(result.isRight()).toBe(true)`
- Test each validation rule: `expect(result.isLeft()).toBe(true)` and verify error code
- Verify error messages are in English
- Test `Id.generate()` returns valid Id without Either wrapper
- Run full test suite: `pnpm test` must pass with 100% coverage of VOs

## Subtasks

### 4.1. Migrate Id VO to Either pattern with create() and generate() methods

**Status:** pending  
**Dependencies:** None  

Refactor Id value object from throw-based to Either-based error handling, implementing both create() for validation and generate() for UUID generation

**Details:**

Update packages/core/src/shared/vo/id/Id.ts:
1. Change static create(value: string) to return Either<ValidationError, Id>
2. Add static generate(): Id method that returns Id directly (no Either) using uuid.v4()
3. Remove all throw statements
4. Update error code to 'INVALID_ID'
5. Translate error messages from Portuguese to English (e.g., 'O id deve ser um UUID' → 'ID must be a valid UUID')
6. Keep constructor private
7. Use Validator pattern for uuid validation in create() method
8. Update test file packages/core/test/shared/vo/Id.test.ts to use Either assertions (.isRight()/.isLeft()) instead of .toThrow()

### 4.2. Migrate DateTime VO to Either pattern

**Status:** pending  
**Dependencies:** 4.1  

Refactor DateTime value object from throw-based to Either-based error handling for date validation

**Details:**

Update packages/core/src/shared/vo/date-time/DateTime.ts:
1. Change static create(value: string) to return Either<ValidationError, DateTime>
2. Remove all throw statements from validation logic
3. Update error code to 'INVALID_DATE_TIME'
4. Translate error messages to English (date format errors, invalid date errors)
5. Keep date parsing and validation logic using Date constructor
6. Handle invalid date formats with left(ValidationError)
7. Update test file packages/core/test/shared/vo/DateTime.test.ts to Either pattern

### 4.3. Migrate Text VO to Either pattern with config support

**Status:** pending  
**Dependencies:** 4.2  

Refactor Text value object with min/max configuration support from throw-based to Either-based error handling

**Details:**

Update packages/core/src/shared/vo/text/Text.ts:
1. Change static create(value: string, config?: ITextConfig) to return Either<ValidationError, Text>
2. Preserve existing min/max/pattern validation using config parameter
3. Use Validator.new(value).required().min(config.min).max(config.max).validate()
4. Remove throw statements at line 33 and elsewhere
5. Update error code to 'INVALID_TEXT'
6. Translate Portuguese error messages to English
7. Handle optional config parameter correctly
8. Update test file packages/core/test/shared/vo/Text.test.ts to Either assertions

### 4.4. Migrate Name VO to Either pattern

**Status:** pending  
**Dependencies:** None  

Refactor Name value object from throw-based to Either-based error handling

**Details:**

Update packages/core/src/shared/vo/name/Name.ts:
1. Change static create(value: string) to return Either<ValidationError, Name>
2. Apply validation: required, minimum 2 characters
3. Remove all throw statements
4. Update error code to 'INVALID_NAME'
5. Translate error messages to English
6. Keep name trimming and normalization logic
7. Update test file packages/core/test/shared/vo/Name.test.ts to Either pattern

### 4.5. Migrate Url VO to Either pattern

**Status:** pending  
**Dependencies:** 4.4  

Refactor Url value object from throw-based to Either-based error handling with URL validation

**Details:**

Update packages/core/src/shared/vo/url/Url.ts:
1. Change static create(value: string) to return Either<ValidationError, Url>
2. Validate URL format using built-in URL constructor or regex
3. Remove all throw statements
4. Update error code to 'INVALID_URL'
5. Translate error messages to English (e.g., 'URL inválida' → 'Invalid URL format')
6. Handle protocol validation (http/https)
7. Update test file packages/core/test/shared/vo/Url.test.ts to Either assertions

### 4.6. Migrate EmploymentType enum-based VO to Either pattern

**Status:** pending  
**Dependencies:** 4.5  

Refactor EmploymentType value object from throw-based to Either-based error handling with enum validation

**Details:**

Update packages/core/src/shared/vo/employment-type/EmploymentType.ts:
1. Change static create(value: string) to return Either<ValidationError, EmploymentType>
2. Validate against enum values (FULL_TIME, PART_TIME, CONTRACT, FREELANCE, INTERNSHIP)
3. Remove throw statements for invalid enum values
4. Update error code to 'INVALID_EMPLOYMENT_TYPE'
5. Translate error messages to English with list of valid values
6. Update test file packages/core/test/shared/vo/EmploymentType.test.ts to Either pattern

### 4.7. Migrate Fluency enum-based VO to Either pattern

**Status:** pending  
**Dependencies:** 4.6  

Refactor Fluency value object from throw-based to Either-based error handling with language proficiency enum validation

**Details:**

Update packages/core/src/shared/vo/fluency/Fluency.ts:
1. Change static create(value: string) to return Either<ValidationError, Fluency>
2. Validate against enum values (BASIC, INTERMEDIATE, ADVANCED, FLUENT, NATIVE)
3. Remove throw statements
4. Update error code to 'INVALID_FLUENCY'
5. Translate error messages to English
6. Update test file packages/core/test/shared/vo/Fluency.test.ts to Either assertions

### 4.8. Migrate LocationType enum-based VO to Either pattern

**Status:** pending  
**Dependencies:** None  

Refactor LocationType value object from throw-based to Either-based error handling with location enum validation

**Details:**

Update packages/core/src/shared/vo/location-type/LocationType.ts:
1. Change static create(value: string) to return Either<ValidationError, LocationType>
2. Validate against enum values (REMOTE, ONSITE, HYBRID)
3. Remove throw statements
4. Update error code to 'INVALID_LOCATION_TYPE'
5. Translate error messages to English
6. Update test file packages/core/test/shared/vo/LocationType.test.ts to Either pattern

### 4.9. Migrate SkillType enum-based VO to Either pattern

**Status:** pending  
**Dependencies:** 4.8  

Refactor SkillType value object from throw-based to Either-based error handling with skill category enum validation

**Details:**

Update packages/core/src/shared/vo/skill-type/SkillType.ts:
1. Change static create(value: string) to return Either<ValidationError, SkillType>
2. Validate against enum values (TECHNICAL, SOFT, LANGUAGE, TOOL, FRAMEWORK, etc.)
3. Remove throw statements
4. Update error code to 'INVALID_SKILL_TYPE'
5. Translate error messages to English
6. Update test file packages/core/test/shared/vo/SkillType.test.ts to Either assertions

### 4.10. Migrate LocalizedText complex VO to Either pattern

**Status:** pending  
**Dependencies:** 4.9  

Refactor LocalizedText value object with complex object validation from throw-based to Either-based error handling

**Details:**

Update packages/core/src/shared/vo/localized-text/LocalizedText.ts:
1. Change static create(value: Record<string, string>) to return Either<ValidationError, LocalizedText>
2. Validate object structure: must have at least one locale key
3. Validate each locale value is non-empty string
4. Remove throw statements at line 53 and elsewhere
5. Update error code to 'INVALID_LOCALIZED_TEXT'
6. Translate Portuguese error messages to English (e.g., 'Texto localizado deve ter pelo menos um idioma' → 'Localized text must have at least one locale')
7. Handle edge cases: empty object, null values, invalid locale keys
8. Update test file packages/core/test/shared/vo/LocalizedText.test.ts to Either pattern

### 4.11. Translate all error messages and standardize error codes

**Status:** pending  
**Dependencies:** 4.10  

Replace all Portuguese error messages with English and ensure consistent INVALID_<NAME> error code format across all VOs

**Details:**

Review and update all 10 migrated VOs:
1. Audit each VO file for remaining Portuguese strings
2. Translate to clear, concise English error messages
3. Verify error codes follow 'INVALID_<VO_NAME>' pattern consistently
4. Standardize error message format: '<Field> must <requirement>' (e.g., 'ID must be a valid UUID')
5. Update validation error details to be descriptive
6. Ensure ValidationError constructor receives correct { code, message } structure
7. Cross-reference all error messages in test files and update assertions

### 4.12. Delete ERROR_MESSAGE.ts and update all test files to Either pattern

**Status:** pending  
**Dependencies:** 4.11  

Remove deprecated i18n error messages file and complete migration of all 19 VO test files to Either-based assertions

**Details:**

Final cleanup tasks:
1. Delete packages/core/src/shared/i18n/ERROR_MESSAGE.ts file (no longer needed)
2. Remove any imports of ERROR_MESSAGE from remaining files
3. Update packages/core/src/shared/vo/index.ts to export all migrated VOs with Either-returning create() methods
4. Audit all 19 test files:
   - Replace .toThrow() assertions with .isLeft()/.isRight()
   - Update expect statements: expect(result.isRight()).toBe(true) for success
   - Update expect statements: expect(result.isLeft()).toBe(true) for failures
   - Verify error codes: expect(result.value.code).toBe('INVALID_<NAME>')
5. Run full test suite: pnpm test in packages/core
6. Fix any remaining type errors or test failures
7. Verify 100% test coverage maintained
