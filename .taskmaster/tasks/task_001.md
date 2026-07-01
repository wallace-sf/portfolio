# Task ID: 1

**Title:** Implement Either pattern for domain error handling

**Status:** pending

**Dependencies:** None

**Priority:** high

**Description:** Create the Either<L, R> type with Left and Right classes as the foundation for functional error handling across the domain layer

**Details:**

Implement `packages/core/src/shared/either.ts` with:

```typescript
export class Left<L, R> {
  readonly value: L;
  constructor(value: L) {
    this.value = value;
  }
  isLeft(): this is Left<L, R> {
    return true;
  }
  isRight(): this is Right<L, R> {
    return false;
  }
}

export class Right<L, R> {
  readonly value: R;
  constructor(value: R) {
    this.value = value;
  }
  isLeft(): this is Left<L, R> {
    return false;
  }
  isRight(): this is Right<L, R> {
    return true;
  }
}

export type Either<L, R> = Left<L, R> | Right<L, R>;

export const left = <L, R>(value: L): Either<L, R> => new Left(value);
export const right = <L, R>(value: R): Either<L, R> => new Right(value);
```

Update `packages/core/src/shared/index.ts` to export: `Either`, `Left`, `Right`, `left`, `right`.

This implementation provides type-safe discriminated unions with `.isLeft()` and `.isRight()` type guards, enabling exhaustive pattern matching and eliminating runtime exceptions for domain errors.

**Test Strategy:**

Unit tests in `packages/core/test/shared/either.test.ts`:
- Test Left creation with `left()` helper
- Test Right creation with `right()` helper
- Test type narrowing: after `if (result.isLeft())` check, TypeScript should infer `result.value` as L type
- Test type narrowing: after `if (result.isRight())` check, TypeScript should infer `result.value` as R type
- Verify immutability of value property
- Test exhaustive checking with discriminated union pattern

## Subtasks

### 1.1. Create Either type with Left and Right classes

**Status:** pending  
**Dependencies:** None  

Implement the core Either pattern with Left and Right classes including type guards in packages/core/src/shared/either.ts

**Details:**

Create `packages/core/src/shared/either.ts` with the complete Either implementation:

1. Implement `Left<L, R>` class:
   - Readonly `value: L` property
   - Constructor accepting `value: L`
   - `isLeft()` type guard returning `this is Left<L, R>`
   - `isRight()` type guard returning false

2. Implement `Right<L, R>` class:
   - Readonly `value: R` property
   - Constructor accepting `value: R`
   - `isLeft()` type guard returning false
   - `isRight()` type guard returning `this is Right<L, R>`

3. Define `Either<L, R>` type as discriminated union: `Left<L, R> | Right<L, R>`

4. Implement helper functions:
   - `left<L, R>(value: L): Either<L, R>` - creates Left instance
   - `right<L, R>(value: R): Either<L, R>` - creates Right instance

Ensure proper TypeScript type inference with discriminated unions. The type guards enable exhaustive pattern matching and type narrowing.

### 1.2. Export Either types from shared module index

**Status:** pending  
**Dependencies:** 1.1  

Update packages/core/src/shared/index.ts to export all Either types and helper functions for consumption by other modules

**Details:**

Update `packages/core/src/shared/index.ts` to properly export the Either pattern:

```typescript
export { Either, Left, Right, left, right } from './either';
```

This makes the Either pattern available to:
- Other shared kernel modules
- Portfolio, Blog, and Contact bounded contexts
- Value Objects and Entities that need error handling

Verify exports are accessible by attempting to import from `@repo/core/shared` in TypeScript.

### 1.3. Write comprehensive unit tests for Either pattern

**Status:** pending  
**Dependencies:** 1.1, 1.2  

Create complete test suite covering type narrowing, helper functions, immutability, and all edge cases for the Either implementation

**Details:**

Create `packages/core/test/shared/either.test.ts` with comprehensive test coverage:

1. **Left creation and behavior:**
   - `left()` helper creates Left instance
   - `isLeft()` returns true
   - `isRight()` returns false
   - `value` property is accessible and correct

2. **Right creation and behavior:**
   - `right()` helper creates Right instance
   - `isLeft()` returns false
   - `isRight()` returns true
   - `value` property is accessible and correct

3. **Type narrowing:**
   - After `if (result.isLeft())`, TypeScript infers `result.value` as L type
   - After `if (result.isRight())`, TypeScript infers `result.value` as R type
   - Exhaustive pattern matching works correctly

4. **Immutability:**
   - `value` property is readonly
   - Cannot reassign value after construction

5. **Generic type inference:**
   - Type parameters are correctly inferred from arguments
   - Complex types (objects, arrays) work correctly

Use Vitest framework. Target 100% code coverage.
