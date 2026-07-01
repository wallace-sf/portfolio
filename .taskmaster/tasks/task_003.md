# Task ID: 3

**Title:** Fix ValueObject and Entity base class bugs

**Status:** pending

**Dependencies:** 1, 2

**Priority:** high

**Description:** Fix ValueObject.equals() for deep comparison, remove isNew concept, and fix Entity.props mutation in constructor

**Details:**

1. Fix `packages/core/src/shared/base/ValueObject.ts`:
   - Remove `isNew` from `IValueObjectProps` interface
   - Remove `isNew` getter method
   - Fix `equals()` method to perform deep equality for object types:
```typescript
public equals(vo: ValueObject<TValue, TConfig>): boolean {
  if (vo == null) return false;
  // For primitive types, use strict equality
  if (typeof this.value !== 'object' || this.value === null) {
    return this.value === vo.value;
  }
  // For object types, perform deep comparison
  return JSON.stringify(this.value) === JSON.stringify(vo.value);
}
```

2. Fix `packages/core/src/shared/base/Entity.ts`:
   - Make `props` field private: `private readonly props: TProps`
   - Fix constructor to avoid mutating input object:
```typescript
constructor(props: TProps) {
  this.created_at = DateTime.new(props.created_at);
  this.deleted_at = props.deleted_at ? DateTime.new(props.deleted_at) : null;
  this.id = Id.new(props.id);
  this.updated_at = DateTime.new(props.updated_at);
  // Use spread to avoid mutating input
  this.props = Object.freeze({ ...props, id: this.id.value });
}
```

3. Update all VOs that pass `isNew` to remove this parameter.

4. Remove invalid `~components/*` path from `packages/core/tsconfig.json`.

**Test Strategy:**

Unit tests:
- Test `ValueObject.equals()` with LocalizedText (object type) to verify deep comparison works
- Test that Entity constructor does not mutate input props object
- Test that Entity.props is immutable (frozen)
- Verify all existing entity and VO tests still pass
- Add specific test case for the LocalizedText.equals() bug mentioned in PRD

## Subtasks

### 3.1. Remove isNew from ValueObject interface and implementation

**Status:** pending  
**Dependencies:** None  

Remove the isNew concept from the ValueObject base class by deleting it from the IValueObjectProps interface and removing the isNew getter method

**Details:**

Edit `packages/core/src/shared/base/ValueObject.ts`:

1. Remove `isNew?: boolean` from the `IValueObjectProps` interface (line 3)
2. Remove the `isNew` getter method (lines 30-32)
3. Clean up any related comments or documentation mentioning isNew

This is a foundational change that must be completed before updating dependent VOs.

### 3.2. Implement deep equality comparison in ValueObject.equals()

**Status:** pending  
**Dependencies:** None  

Replace the shallow equality comparison in ValueObject.equals() with deep comparison that handles both primitive and object types correctly

**Details:**

Edit `packages/core/src/shared/base/ValueObject.ts`, update the `equals()` method (around line 19):

```typescript
public equals(vo: ValueObject<TValue, TConfig>): boolean {
  if (vo == null) return false;
  // For primitive types, use strict equality
  if (typeof this.value !== 'object' || this.value === null) {
    return this.value === vo.value;
  }
  // For object types, perform deep comparison
  return JSON.stringify(this.value) === JSON.stringify(vo.value);
}
```

This handles primitives (string, number, boolean) with strict equality and objects (like LocalizedText's Record<string, string>) with deep comparison.

### 3.3. Fix Entity constructor to prevent props mutation and make props private

**Status:** pending  
**Dependencies:** None  

Update Entity base class to make props private and fix constructor to avoid mutating the input props object

**Details:**

Edit `packages/core/src/shared/base/Entity.ts`:

1. Change line 14: `private readonly props: TProps` (was public)
2. Update constructor (around line 23) to use spread operator:

```typescript
constructor(props: TProps) {
  this.created_at = DateTime.new(props.created_at);
  this.deleted_at = props.deleted_at ? DateTime.new(props.deleted_at) : null;
  this.id = Id.new(props.id);
  this.updated_at = DateTime.new(props.updated_at);
  // Use spread to avoid mutating input
  this.props = Object.freeze({ ...props, id: this.id.value });
}
```

This prevents external mutation of the props object passed to the constructor.

### 3.4. Update all 10 Value Objects to remove isNew parameter usage

**Status:** pending  
**Dependencies:** 3.1  

Remove isNew parameter from all VOs that currently pass it to the ValueObject base class constructor

**Details:**

Update these 10 VOs in `packages/core/src/shared/vo/`:
- Id.ts (line 11)
- DateTime.ts
- Text.ts
- Name.ts
- Url.ts
- EmploymentType.ts
- Fluency.ts
- LocationType.ts
- SkillType.ts
- LocalizedText.ts

For each VO:
1. Find the super() call in the constructor
2. Remove the `isNew` parameter from the props object passed to super()
3. Example: Change `super({ value, isNew })` to `super({ value })`

Also remove the invalid `~components/*` path from `packages/core/tsconfig.json` if present.

### 3.5. Comprehensive testing of equality, immutability, and regression validation

**Status:** pending  
**Dependencies:** 3.2, 3.4  

Create comprehensive test suite for the refactored base classes and validate that all 19 existing test files pass without regression

**Details:**

1. Create/update `packages/core/test/shared/ValueObject.test.ts`:
   - Test deep equality with LocalizedText (object with Record<string, string>)
   - Test primitive equality with Id, DateTime, Text
   - Test null/undefined handling in equals()
   - Test that different objects with same structure are equal

2. Create/update `packages/core/test/shared/Entity.test.ts`:
   - Test props immutability (Object.isFrozen)
   - Test constructor doesn't mutate input props
   - Test that entity creation works correctly

3. Run all 19 existing test files to validate no regression:
   - Run `npm test` or equivalent in packages/core
   - Verify all tests pass
   - Fix any breaking changes discovered

4. Document the changes in tests to explain the new behavior.
