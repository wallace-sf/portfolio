import { Validator } from '@repo/utils';
import { v4 as uuid } from 'uuid';

import { ValueObject } from '../base/ValueObject';

export class Id extends ValueObject<string> {
  static readonly ERROR_CODE = 'ERROR_INVALID_ID';

  private constructor(value?: string) {
    super({ value: value ?? uuid(), isNew: value == null });
    this._validate(this._props.value);
  }

  static new(value?: string): Id {
    return new Id(value);
  }

  static isValid(value = ''): boolean {
    return Validator.new().uuid('O id deve ser um UUID.').validate(value)
      .isValid;
  }

  private _validate(value?: string): void {
    const isValid = Id.isValid(value);

    if (!isValid) throw new Error(Id.ERROR_CODE);
  }
}
