import { DateRange, ValidationError } from '~/index';

const START = '2020-01-01T00:00:00.000Z';
const END = '2023-12-31T00:00:00.000Z';
const BEFORE_START = '2019-06-01T00:00:00.000Z';

describe('DateRange', () => {
  describe('when created with start and end dates', () => {
    it('should return Right when start is before end', () => {
      const result = DateRange.create(START, END);

      expect(result.isRight()).toBe(true);
    });

    it('should return Right when start equals end', () => {
      const result = DateRange.create(START, START);

      expect(result.isRight()).toBe(true);
    });

    it('should expose startAt getter', () => {
      const result = DateRange.create(START, END);

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.startAt.value).toBe(START);
    });

    it('should expose endAt getter', () => {
      const result = DateRange.create(START, END);

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.endAt?.value).toBe(END);
    });

    it('should return false for isActive() when endAt is defined', () => {
      const result = DateRange.create(START, END);

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.isActive()).toBe(false);
    });
  });

  describe('when created with start date only (ongoing)', () => {
    it('should return Right without an end date', () => {
      const result = DateRange.create(START);

      expect(result.isRight()).toBe(true);
    });

    it('should return true for isActive() when endAt is undefined', () => {
      const result = DateRange.create(START);

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.isActive()).toBe(true);
    });

    it('should return undefined for endAt', () => {
      const result = DateRange.create(START);

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.endAt).toBeUndefined();
    });
  });

  describe('when created from invalid values', () => {
    it('should return Left when start date is invalid', () => {
      const result = DateRange.create('not-a-date');

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(ValidationError);
    });

    it('should return Left when end date is invalid', () => {
      const result = DateRange.create(START, 'not-a-date');

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(ValidationError);
    });

    it('should return Left with INVALID_DATE_RANGE when start is after end', () => {
      const result = DateRange.create(END, BEFORE_START);

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(ValidationError);
      expect((result.value as ValidationError).code).toBe(DateRange.ERROR_CODE);
      expect((result.value as ValidationError).message).toContain(
        'Start date must be before or equal to end date',
      );
    });
  });

  describe('when compared', () => {
    it('should be equal when start and end are identical', () => {
      const r1 = DateRange.create(START, END);
      const r2 = DateRange.create(START, END);

      expect(r1.isRight() && r2.isRight()).toBe(true);
      if (!r1.isRight() || !r2.isRight()) return;
      expect(r1.value.equals(r2.value)).toBe(true);
    });

    it('should not be equal when end dates differ', () => {
      const r1 = DateRange.create(START, END);
      const r2 = DateRange.create(START);

      expect(r1.isRight() && r2.isRight()).toBe(true);
      if (!r1.isRight() || !r2.isRight()) return;
      expect(r1.value.equals(r2.value)).toBe(false);
    });
  });
});
