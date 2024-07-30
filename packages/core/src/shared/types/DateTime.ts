import { ValueObject } from '../base/ValueObject';

export class DateTime extends ValueObject<DateTime, string> {
  static readonly ERROR_INVALID_DATETIME = 'ERROR_INVALID_DATETIME';

  private constructor(value?: string) {
    super({ value: value ?? new Date().toISOString(), isNew: value == null });
    this._validate(this._props.value);
  }

  static new(value?: string): DateTime {
    return new DateTime(value);
  }

  static isValid(value = ''): boolean {
    return !isNaN(new Date(value).getTime()); // Use date validator from DateValidator class
  }

  private _validate(value?: string): void {
    const isValid = DateTime.isValid(value);

    if (!isValid) throw new Error(DateTime.ERROR_INVALID_DATETIME);
  }
}
