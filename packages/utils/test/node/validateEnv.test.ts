import { validateEnv } from '../../src/env/validateEnv';

describe('validateEnv', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should not throw when all required variables are set', () => {
    process.env['FOO'] = 'foo';
    process.env['BAR'] = 'bar';

    expect(() => validateEnv(['FOO', 'BAR'])).not.toThrow();
  });

  it('should throw when a single variable is missing', () => {
    delete process.env['MISSING_VAR'];

    expect(() => validateEnv(['MISSING_VAR'])).toThrow('MISSING_VAR');
  });

  it('should list all missing variables in a single error', () => {
    delete process.env['FIRST_VAR'];
    delete process.env['SECOND_VAR'];

    expect(() => validateEnv(['FIRST_VAR', 'SECOND_VAR'])).toThrow(
      /FIRST_VAR.*SECOND_VAR/,
    );
  });

  it('should not throw when given an empty array', () => {
    expect(() => validateEnv([])).not.toThrow();
  });
});
