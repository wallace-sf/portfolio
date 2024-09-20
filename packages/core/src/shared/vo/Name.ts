import { Validator, ValidationError } from '@repo/utils';

import { ValueObject } from '../base/ValueObject';

export class Name extends ValueObject<string> {
  static readonly ERROR_CODE = 'ERROR_INVALID_NAME';

  private constructor(value: string) {
    super({ value, isNew: false });
    this._validate(this._props.value);
  }

  static new(value?: string): Name {
    return new Name(value ?? '');
  }

  private _validate(value?: string): void {
    const { error, isValid } = Validator.new()
      .alpha('Nome deve conter apenas letras.')
      .length(2, 100, 'O nome deve estar entre 2 e 100 caracteres.')
      .validate(value);

    const ERROR_CODE = Name.ERROR_CODE;

    if (!isValid && error) throw new ValidationError(ERROR_CODE, error);
  }

  public get normalized(): string {
    return this.value.trim().replace(/\s+/g, ' ');
  }

  public get capitalized(): string {
    return this.normalized
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }
}
