import { Validator, ValidationError } from '@repo/utils';

import { ValueObject } from '../base/ValueObject';

export type EmploymentTypeValue = Readonly<
  typeof EmploymentType.EMPLOYMENTS
>[number];

export class EmploymentType extends ValueObject<EmploymentTypeValue> {
  static readonly ERROR_CODE = 'ERROR_INVALID_EMPLOYMENT_TYPE';
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
    super({ value, isNew: false });
    this._validate(value);
  }

  static new(value: EmploymentTypeValue): EmploymentType {
    return new EmploymentType(value);
  }

  private _validate(value: string): void {
    const { error, isValid } = Validator.new(value)
      .in(
        [...EmploymentType.EMPLOYMENTS],
        'O valor deve ser um tipo de emprego válido.',
      )
      .validate();

    const ERROR_CODE = EmploymentType.ERROR_CODE;

    if (!isValid && error) throw new ValidationError(ERROR_CODE, error);
  }
}
