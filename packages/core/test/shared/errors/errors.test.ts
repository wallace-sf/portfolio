import { UnauthorizedError } from '~/identity';
import { DomainError, NotFoundError, ValidationError } from '~/index';

describe('DomainError', () => {
  it('stores code and details, has correct name', () => {
    const error = new DomainError('TEST_CODE', {
      message: 'Technical message',
      details: { foo: 'bar' },
    });

    expect(error.code).toBe('TEST_CODE');
    expect(error.details).toEqual({ foo: 'bar' });
    expect(error.name).toBe('DomainError');
    expect(error.message).toBe('Technical message');
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(DomainError);
  });

  it('uses code as message when options.message is not provided', () => {
    const error = new DomainError('MY_CODE');

    expect(error.message).toBe('MY_CODE');
    expect(error.code).toBe('MY_CODE');
  });

  it('supports optional cause', () => {
    const cause = new Error('original');
    const error = new DomainError('CODE', { cause });

    expect(error.cause).toBe(cause);
  });
});

describe('NotFoundError', () => {
  it('exposes CODE = NOT_FOUND as a static constant', () => {
    expect(NotFoundError.CODE).toBe('NOT_FOUND');
  });

  it('defaults to NOT_FOUND code', () => {
    const error = new NotFoundError();

    expect(error.code).toBe(NotFoundError.CODE);
    expect(error.name).toBe('NotFoundError');
    expect(error).toBeInstanceOf(DomainError);
    expect(error).toBeInstanceOf(NotFoundError);
  });

  it('accepts optional details', () => {
    const error = new NotFoundError({ entity: 'Project', slug: 'my-slug' });

    expect(error.code).toBe('NOT_FOUND');
    expect(error.details).toEqual({ entity: 'Project', slug: 'my-slug' });
  });
});

describe('ValidationError', () => {
  it('exposes CODE = VALIDATION_ERROR as a static constant', () => {
    expect(ValidationError.CODE).toBe('VALIDATION_ERROR');
  });

  it('defaults to VALIDATION_ERROR when no args', () => {
    const error = new ValidationError();

    expect(error.code).toBe(ValidationError.CODE);
    expect(error.name).toBe('ValidationError');
    expect(error).toBeInstanceOf(DomainError);
    expect(error).toBeInstanceOf(ValidationError);
  });

  it('accepts code and message in options', () => {
    const error = new ValidationError({
      code: 'ERROR_INVALID_ID',
      message: 'O id deve ser um UUID.',
    });

    expect(error.code).toBe('ERROR_INVALID_ID');
    expect(error.message).toBe('O id deve ser um UUID.');
    expect(error).toBeInstanceOf(ValidationError);
  });

  it('accepts code and details in options', () => {
    const details = { field: 'email', rule: 'format' };
    const error = new ValidationError({ code: 'INVALID_EMAIL', details });

    expect(error.code).toBe('INVALID_EMAIL');
    expect(error.details).toEqual(details);
  });

  it('accepts details-only (uses VALIDATION_ERROR)', () => {
    const details = { field: 'name' };
    const error = new ValidationError({ details });

    expect(error.code).toBe('VALIDATION_ERROR');
    expect(error.details).toEqual(details);
  });
});

describe('UnauthorizedError', () => {
  it('exposes CODE = UNAUTHORIZED as a static constant', () => {
    expect(UnauthorizedError.CODE).toBe('UNAUTHORIZED');
  });

  it('defaults to UNAUTHORIZED code and correct name', () => {
    const error = new UnauthorizedError();

    expect(error.code).toBe(UnauthorizedError.CODE);
    expect(error.message).toBe('Unauthorized access');
    expect(error.name).toBe('UnauthorizedError');
    expect(error).toBeInstanceOf(DomainError);
    expect(error).toBeInstanceOf(UnauthorizedError);
  });

  it('accepts custom message', () => {
    const error = new UnauthorizedError({ message: 'Token expired' });

    expect(error.code).toBe('UNAUTHORIZED');
    expect(error.message).toBe('Token expired');
  });

  it('accepts optional details', () => {
    const error = new UnauthorizedError({ details: { reason: 'token_expired' } });

    expect(error.code).toBe('UNAUTHORIZED');
    expect(error.details).toEqual({ reason: 'token_expired' });
  });
});
