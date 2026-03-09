import { ValueObject } from '../base/ValueObject';
import { left, right, Either } from '../either';
import { ValidationError } from '../errors';
import { DateTime } from './DateTime';

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

      if (startResult.value.ms > endResult.value.ms) {
        return left(
          new ValidationError({
            code: DateRange.ERROR_CODE,
            message: 'Start date must be before or equal to end date.',
          }),
        );
      }

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
