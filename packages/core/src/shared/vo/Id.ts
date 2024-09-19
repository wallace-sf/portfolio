import { Validator, ValidationError } from '@repo/utils';
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

  private _validate(value?: string): void {
    const { error, isValid } = Validator.new()
      .uuid('O id deve ser um UUID.')
      .validate(value);

    const ERROR_CODE = Id.ERROR_CODE;

    if (!isValid && error) throw new ValidationError(ERROR_CODE, error);
  }
}
