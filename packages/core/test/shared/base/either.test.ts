import { Either, Left, Right, left, right } from '../../../src/shared/either';

describe('left()', () => {
  it('should create a Left instance when called with a value', () => {
    const result = left<string, number>('error');

    expect(result).toBeInstanceOf(Left);
    expect(result.value).toBe('error');
  });

  it('should return true for isLeft() when instance is Left', () => {
    const result = left<string, number>('error');

    expect(result.isLeft()).toBe(true);
  });

  it('should return false for isRight() when instance is Left', () => {
    const result = left<string, number>('error');

    expect(result.isRight()).toBe(false);
  });
});

describe('right()', () => {
  it('should create a Right instance when called with a value', () => {
    const result = right<string, number>(42);

    expect(result).toBeInstanceOf(Right);
    expect(result.value).toBe(42);
  });

  it('should return false for isLeft() when instance is Right', () => {
    const result = right<string, number>(42);

    expect(result.isLeft()).toBe(false);
  });

  it('should return true for isRight() when instance is Right', () => {
    const result = right<string, number>(42);

    expect(result.isRight()).toBe(true);
  });
});

describe('Either type narrowing', () => {
  function parse(raw: string): Either<string, number> {
    const n = Number(raw);
    return isNaN(n) ? left('invalid number') : right(n);
  }

  it('should narrow value to L type when isLeft() is true', () => {
    const result = parse('abc');

    if (result.isLeft()) {
      const errorMessage: string = result.value;
      expect(errorMessage).toBe('invalid number');
    } else {
      throw new Error('Expected Left');
    }
  });

  it('should narrow value to R type when isRight() is true', () => {
    const result = parse('10');

    if (result.isRight()) {
      const num: number = result.value;
      expect(num).toBe(10);
    } else {
      throw new Error('Expected Right');
    }
  });
});

describe('Either immutability', () => {
  it('should preserve Left value after construction', () => {
    const instance = new Left<string, number>('err');

    expect(instance.value).toBe('err');
  });

  it('should preserve Right value after construction', () => {
    const instance = new Right<string, number>(1);

    expect(instance.value).toBe(1);
  });
});

describe('Either with complex types', () => {
  it('should work with object as Left value', () => {
    const error = { code: 'NOT_FOUND', message: 'Not found' };
    const result = left<typeof error, string[]>(error);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toEqual(error);
  });

  it('should work with array as Right value', () => {
    const items = [1, 2, 3];
    const result = right<string, number[]>(items);

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual(items);
  });
});
