import { describe, it, expect } from 'vitest';

import { ValidationError } from '../../../src/shared/errors/ValidationError';
import { collect, left, right } from '../../../src/shared/either';

describe('collect()', () => {
  it('should return Right with all values when all eithers are Right', () => {
    const result = collect([right(1), right(2), right(3)]);

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual([1, 2, 3]);
  });

  it('should return Left with the first error when the first either is Left', () => {
    const error = new ValidationError({ code: 'ERR_A', message: 'first' });

    const result = collect([left(error), right(2), right(3)]);

    expect(result.isLeft()).toBe(true);
    if (!result.isLeft()) return;
    expect(result.value).toBeInstanceOf(ValidationError);
    expect((result.value as ValidationError).code).toBe('ERR_A');
  });

  it('should return Left with the first error and ignore subsequent eithers', () => {
    const firstError = new ValidationError({ code: 'ERR_FIRST', message: 'first' });
    const secondError = new ValidationError({ code: 'ERR_SECOND', message: 'second' });

    const result = collect([right(1), left(firstError), left(secondError)]);

    expect(result.isLeft()).toBe(true);
    if (!result.isLeft()) return;
    expect(result.value).toBeInstanceOf(ValidationError);
    expect((result.value as ValidationError).code).toBe('ERR_FIRST');
  });

  it('should return Right with empty array when given empty input', () => {
    const result = collect([]);

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual([]);
  });

  it('should preserve the order of Right values in the result array', () => {
    const result = collect([right('a'), right('b'), right('c')]);

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual(['a', 'b', 'c']);
  });

  it('should work with heterogeneous types', () => {
    const result = collect([right(42), right('hello'), right(true)]);

    expect(result.isRight()).toBe(true);
    if (!result.isRight()) return;
    const [num, str, bool] = result.value;
    expect(num).toBe(42);
    expect(str).toBe('hello');
    expect(bool).toBe(true);
  });
});
