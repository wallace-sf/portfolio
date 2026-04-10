import { Validator } from '@repo/utils/validator';

import { ValueObject } from '~/shared/base/ValueObject';
import { left, right, Either } from '~/shared/either';
import { ValidationError } from '~/shared/errors';
import { DateTime } from '~/shared/vo/DateTime';

interface IDateRangeValue {
  startAt: DateTime;
  endAt?: DateTime;
}

export class DateRange extends ValueObject<IDateRangeValue> {
  static readonly ERROR_CODE = 'INVALID_DATE_RANGE';

  private constructor(startAt: DateTime, endAt?: DateTime) {
    super({ value: { startAt, endAt } });
  }

  static create(
    start: string,
    end?: string,
  ): Either<ValidationError, DateRange> {
    const startResult = DateTime.create(start);
    if (startResult.isLeft()) return left(startResult.value);

    if (end !== undefined) {
      const endResult = DateTime.create(end);
      if (endResult.isLeft()) return left(endResult.value);

      const { error, isValid } = Validator.of(startResult.value.ms)
        .refine(
          (startMs) => startMs <= endResult.value.ms,
          'Start date must be before or equal to end date.',
        )
        .validate();

      if (!isValid && error)
        return left(
          new ValidationError({ code: DateRange.ERROR_CODE, message: error }),
        );

      return right(new DateRange(startResult.value, endResult.value));
    }

    return right(new DateRange(startResult.value));
  }

  isActive(): boolean {
    return this.value.endAt === undefined;
  }

  get startAt(): DateTime {
    return this.value.startAt;
  }

  get endAt(): DateTime | undefined {
    return this.value.endAt;
  }
}
