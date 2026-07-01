# Task ID: 9

**Title:** Update Experience entity and create ExperienceSkill VO

**Status:** pending

**Dependencies:** 6

**Priority:** high

**Description:** Add missing fields to Experience entity (logo, description) and create ExperienceSkill VO to support contextual work descriptions per skill

**Details:**

1. Create `packages/core/src/portfolio/entities/experience/model/ExperienceSkill.ts`:
```typescript
import { ValueObject } from '../../../../shared/base/ValueObject';
import { LocalizedText } from '../../../../shared/vo';
import { Skill } from '../../skill/model/Skill';
import { Either, left, right } from '../../../../shared/either';
import { ValidationError } from '../../../../shared/errors';

export interface IExperienceSkillProps {
  skill: ISkillProps;
  workDescription: Record<string, string>;
}

export class ExperienceSkill extends ValueObject<{
  skill: Skill;
  workDescription: LocalizedText;
}> {
  private constructor(skill: Skill, workDescription: LocalizedText) {
    super({ value: { skill, workDescription } });
  }

  static create(props: IExperienceSkillProps): Either<ValidationError, ExperienceSkill> {
    const skillResult = Skill.create(props.skill);
    if (skillResult.isLeft()) return left(skillResult.value);

    const workDescResult = LocalizedText.create(props.workDescription);
    if (workDescResult.isLeft()) return left(workDescResult.value);

    return right(new ExperienceSkill(skillResult.value, workDescResult.value));
  }

  get skill(): Skill {
    return this.value.skill;
  }

  get workDescription(): LocalizedText {
    return this.value.workDescription;
  }
}
```

2. Update `packages/core/src/portfolio/entities/experience/model/Experience.ts`:
```typescript
export interface IExperienceProps extends IEntityProps {
  // Updated to LocalizedText
  company: Record<string, string>;
  position: Record<string, string>;
  location: Record<string, string>;
  
  // New fields
  logo: { url: string; alt: Record<string, string> };
  description: Record<string, string>;
  
  // Updated type
  skills: IExperienceSkillProps[];
  
  // Existing
  employment_type: EmploymentTypeValue;
  location_type: LocationTypeValue;
  start_at: string;
  end_at?: string;
}

export class Experience extends Entity<Experience, IExperienceProps> {
  public readonly company: LocalizedText;
  public readonly position: LocalizedText;
  public readonly location: LocalizedText;
  public readonly logo: Image;
  public readonly description: LocalizedText;
  public readonly employment_type: EmploymentType;
  public readonly location_type: LocationType;
  public readonly skills: ExperienceSkill[];
  public readonly period: DateRange;

  private constructor(props: IExperienceProps, domainObjects: {...}) {
    super(props);
    // Initialize fields
  }

  static create(props: IExperienceProps): Either<DomainError, Experience> {
    // Validate company, position, location as LocalizedText
    const companyResult = LocalizedText.create(props.company);
    if (companyResult.isLeft()) return left(companyResult.value);

    // Validate logo
    const logoResult = Image.create(props.logo.url, props.logo.alt);
    if (logoResult.isLeft()) return left(logoResult.value);

    // Validate description
    const descResult = LocalizedText.create(props.description);
    if (descResult.isLeft()) return left(descResult.value);

    // Validate period using DateRange VO (delegates validation)
    const periodResult = DateRange.create(props.start_at, props.end_at);
    if (periodResult.isLeft()) return left(periodResult.value);

    // Create ExperienceSkills
    const skills: ExperienceSkill[] = [];
    for (let i = 0; i < props.skills.length; i++) {
      const skillResult = ExperienceSkill.create(props.skills[i]);
      if (skillResult.isLeft()) {
        return left(new ValidationError({
          code: 'INVALID_EXPERIENCE_SKILL',
          message: `Invalid skill at index ${i}`,
          details: { index: i, error: skillResult.value }
        }));
      }
      skills.push(skillResult.value);
    }

    return right(new Experience(props, {
      company: companyResult.value,
      position: positionResult.value,
      location: locationResult.value,
      logo: logoResult.value,
      description: descResult.value,
      employment_type: employmentTypeResult.value,
      location_type: locationTypeResult.value,
      period: periodResult.value,
      skills
    }));
  }
}
```

3. Remove date validation logic from Experience (delegated to DateRange)

4. Update `ExperienceBuilder` and tests

**Test Strategy:**

Tests in `packages/core/test/portfolio/experience/`:

**ExperienceSkill.test.ts:**
- Valid creation with skill and work description → Right
- Invalid skill → Left
- Invalid work description → Left
- Getter methods return correct instances

**Experience.test.ts:**
- Valid creation with all new fields → Right
- Test LocalizedText fields (company, position, location, description)
- Test Image field (logo)
- Invalid date range handled by DateRange VO → Left
- Invalid ExperienceSkill at index → Left with index in error
- Date validation is delegated to DateRange (no duplication)

Update ExperienceBuilder in `test/data/ExperienceBuilder.ts` to support new fields

## Subtasks

### 9.1. Create ExperienceSkill Value Object

**Status:** pending  
**Dependencies:** None  

Create ExperienceSkill VO in packages/core/src/portfolio/entities/experience/model/ExperienceSkill.ts that composes Skill entity and LocalizedText VO for workDescription field using Either pattern

**Details:**

Create ExperienceSkill.ts extending ValueObject with:
- IExperienceSkillProps interface (skill: ISkillProps, workDescription: Record<string, string>)
- Private constructor accepting Skill and LocalizedText
- Static create() returning Either<ValidationError, ExperienceSkill>
- Chain Either validations: Skill.create() then LocalizedText.create()
- Return left with ValidationError if either fails
- Implement getters for skill and workDescription
- Follow Either pattern from CLAUDE.md (never throw)
- Export interface and class from experience index

### 9.2. Update IExperienceProps interface with new fields

**Status:** pending  
**Dependencies:** 9.1  

Update IExperienceProps interface in Experience.ts to add logo (Image props), description (LocalizedText props), and change skills from ISkillProps[] to IExperienceSkillProps[]

**Details:**

Modify IExperienceProps in packages/core/src/portfolio/entities/experience/model/Experience.ts:
- Add logo field: { url: string; alt: Record<string, string> }
- Add description field: Record<string, string> (LocalizedText props)
- Change skills field type from ISkillProps[] to IExperienceSkillProps[]
- Keep existing fields: company, position, location (still Record<string, string>), employment_type, location_type, start_at, end_at
- Update imports to include IExperienceSkillProps from ExperienceSkill
- Ensure interface extends IEntityProps

### 9.3. Convert Text fields to LocalizedText in Experience entity

**Status:** pending  
**Dependencies:** 9.2  

Convert company, position, and location fields from Text VO to LocalizedText VO in Experience entity class, updating field types, constructor, and create() method validations

**Details:**

Update Experience class in packages/core/src/portfolio/entities/experience/model/Experience.ts:
- Change field types: company, position, location from Text to LocalizedText
- Update constructor to accept LocalizedText instances
- Update create() method to call LocalizedText.create() for company, position, location
- Chain Either validations: if companyResult.isLeft() return left(companyResult.value)
- Remove old Text.create() calls
- Update imports to use LocalizedText from shared/vo
- Ensure all validations follow Either pattern

### 9.4. Add logo and description fields to Experience entity

**Status:** pending  
**Dependencies:** None  

Add logo (Image) and description (LocalizedText) fields to Experience entity class, including field declarations, constructor initialization, and Either-based validation in create() method

**Details:**

Update Experience class in packages/core/src/portfolio/entities/experience/model/Experience.ts:
- Add public readonly fields: logo: Image, description: LocalizedText
- Update constructor to accept and initialize logo and description
- Add validation in create(): Image.create(props.logo.url, props.logo.alt)
- Add validation in create(): LocalizedText.create(props.description)
- Chain Either validations following pattern: if logoResult.isLeft() return left(logoResult.value)
- Implement getters if needed
- Update imports to include Image from shared/vo
- Ensure all new validations return left with ValidationError on failure

### 9.5. Update skills field from Skill[] to ExperienceSkill[] with indexed validation

**Status:** pending  
**Dependencies:** 9.4  

Change skills field type from Skill[] to ExperienceSkill[] in Experience entity, update create() method to validate array of ExperienceSkill with indexed error handling

**Details:**

Update Experience class skills field:
- Change field type: public readonly skills: ExperienceSkill[]
- Update create() method to iterate over props.skills (IExperienceSkillProps[])
- For each skill, call ExperienceSkill.create(props.skills[i])
- If validation fails, return left with ValidationError containing:
  - code: 'INVALID_EXPERIENCE_SKILL'
  - message: 'Invalid skill at index {i}'
  - details: { index: i, error: skillResult.value }
- Collect all valid ExperienceSkill instances in array
- Pass array to constructor
- Update constructor to accept ExperienceSkill[]
- Remove old Skill[] logic

### 9.6. Remove date validation logic from Experience and delegate to DateRange

**Status:** pending  
**Dependencies:** 9.5  

Remove manual date validation logic from Experience.create() method (lines 51-63) and delegate all period validation to DateRange VO which already handles start_at/end_at validation

**Details:**

Update Experience.create() method:
- Locate date validation code block (currently lines 51-63 checking start_at/end_at)
- Replace with single call: DateRange.create(props.start_at, props.end_at)
- Chain Either validation: const periodResult = DateRange.create(props.start_at, props.end_at)
- If periodResult.isLeft() return left(periodResult.value)
- Remove all manual date parsing, comparison, and validation logic
- DateRange VO (from Task 5 dependency) handles: required start_at, optional end_at, end >= start validation
- Update constructor to accept DateRange instance
- Ensure period field type is DateRange
- Remove any date-related helper methods if they exist

### 9.7. Update ExperienceBuilder and create comprehensive tests

**Status:** pending  
**Dependencies:** 9.6  

Refactor ExperienceBuilder to support new Experience structure (logo, description, ExperienceSkill[], LocalizedText fields) and create comprehensive test suite for ExperienceSkill and updated Experience entity

**Details:**

Update ExperienceBuilder:
- Add withLogo(url: string, alt: Record<string, string>) method
- Add withDescription(description: Record<string, string>) method
- Update withSkills() to accept IExperienceSkillProps[] instead of ISkillProps[]
- Update withCompany/Position/Location to accept Record<string, string> (LocalizedText props)
- Ensure build() constructs valid IExperienceProps with all new fields
- Provide sensible defaults for logo, description

Create test files:
- ExperienceSkill.test.ts covering all scenarios from testStrategy above
- Update Experience.test.ts with tests for logo, description, ExperienceSkill[] validation
- Test all Either-based validations
- Test indexed error handling for skills array
- Test DateRange delegation
- Verify all validation error codes and messages
