import { Validator } from '@repo/utils';

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

  static isValid(value = ''): boolean {
    return Validator.new()
      .length(3, 100, 'O nome deve estar entre 3 e 100 caracteres.')
      .alpha('Nome deve conter apenas letras.')
      .validate(value).isValid;
  }

  private _validate(value?: string): void {
    const isValid = Name.isValid(value);

    if (!isValid) throw new Error(Name.ERROR_CODE);
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
