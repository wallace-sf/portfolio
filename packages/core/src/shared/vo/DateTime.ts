import { Validator, ValidationError } from '@repo/utils';

import { ValueObject } from '../base/ValueObject';

export class DateTime extends ValueObject<string> {
  static readonly ERROR_CODE = 'ERROR_INVALID_DATETIME';

  private constructor(value?: string) {
    super({ value: value ?? new Date().toISOString(), isNew: value == null });
    this._validate(this._props.value);
  }

  static new(value?: string): DateTime {
    return new DateTime(value);
  }

  private _validate(value?: string): void {
    const { error, isValid } = Validator.new(value)
      .datetime('O valor deve ser uma data e hora válida.')
      .validate();

    const ERROR_CODE = DateTime.ERROR_CODE;

    if (!isValid && error) throw new ValidationError(ERROR_CODE, error);
  }
}
