import { Validator } from '@repo/utils';

import { ValueObject } from '../base/ValueObject';
import { left, right, Either } from '../either';
import { ValidationError } from '../errors';

export type EmploymentTypeValue = Readonly<
  typeof EmploymentType.EMPLOYMENTS
>[number];

export class EmploymentType extends ValueObject<EmploymentTypeValue> {
  static readonly ERROR_CODE = 'INVALID_EMPLOYMENT_TYPE';
  static readonly EMPLOYMENTS = [
    'FULL_TIME',
    'PART_TIME',
    'SELF_EMPLOYED',
    'FREELANCE',
    'TEMPORARY',
    'INTERNSHIP',
    'APPRENTICE',
    'TRAINEE',
  ] as const;

  private constructor(value: EmploymentTypeValue) {
    super({ value });
  }

  static create(
    value: EmploymentTypeValue,
  ): Either<ValidationError, EmploymentType> {
    const { error, isValid } = Validator.new(value)
      .in(
        [...EmploymentType.EMPLOYMENTS],
        'The value must be a valid employment type.',
      )
      .validate();

    if (!isValid && error)
      return left(
        new ValidationError({
          code: EmploymentType.ERROR_CODE,
          message: error,
        }),
      );

    return right(new EmploymentType(value));
  }

}
