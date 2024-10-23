import Mustache from 'mustache';

import {
  greaterThan,
  greaterThanOrEqual,
  isAlpha,
  isDateTime,
  isEmpty,
  isIn,
  isLength,
  isNil,
  isNotNil,
  isString,
  isUUID,
  isUrl,
  lessThan,
  lessThanOrEqual,
} from '../validations';

export type Validation = <TValue>(value: TValue) => boolean;

export class Validator<TValue> {
  private readonly _validations: Array<[Validation, string]>;
  private _error: string | null = null;
  private _value: TValue;

  private constructor(value: TValue) {
    this._validations = [];
    this._error = null;
    this._value = value;
  }

  static new<TValue>(value: TValue): Validator<TValue> {
    return new Validator<TValue>(value);
  }

  static combine<TValue>(...validators: Validator<TValue>[]) {
    let isValid = true;
    let error: string | null = null;

    for (const validation of validators) {
      const { isValid: validationValid, error: validationError } =
        validation.validate();

      isValid = validationValid;
      error = validationError;

      if (!isValid) break;
    }

    return { isValid, error };
  }

  private append(validation: Validation, error: string) {
    this._validations.push([validation, error]);

    return this;
  }

  public validate() {
    for (const [validation, error] of this._validations) {
      const isValid = validation(this._value);

      this._error = isValid ? null : error;

      if (this._error) break;
    }

    return { isValid: this.isValid, error: this.error };
  }

  get error(): string | null {
    return this._error;
  }

  get isValid(): boolean {
    return this._error == null;
  }

  public length(min: number, max: number, error: string): Validator<TValue> {
    const config = { min, max };

    this.append(
      (value) => isLength(value as string, config),
      Mustache.render(error, config),
    );

    return this;
  }

  public alpha(error: string): Validator<TValue> {
    this.append((value) => isAlpha(value as string), error);

    return this;
  }

  public empty(error: string): Validator<TValue> {
    this.append((value) => isEmpty(value as string), error);

    return this;
  }

  public nil(error: string): Validator<TValue> {
    this.append((value) => isNil(value), error);

    return this;
  }

  public notNil(error: string): Validator<TValue> {
    this.append((value) => isNotNil(value), error);

    return this;
  }

  public string(error: string): Validator<TValue> {
    this.append((value) => isString(value), error);

    return this;
  }

  public uuid(error: string): Validator<TValue> {
    this.append((value) => isUUID(value as string), error);

    return this;
  }

  public url(error: string): Validator<TValue> {
    this.append((value) => isUrl(value as string), error);

    return this;
  }

  public datetime(error: string): Validator<TValue> {
    this.append((value) => isDateTime(value as string), error);

    return this;
  }

  public in(values: string[], error: string): Validator<TValue> {
    this.append((value) => isIn(value as string, values), error);

    return this;
  }

  public gt(valueB: number, error: string): Validator<TValue> {
    this.append((valueA) => greaterThan(valueA as number, valueB), error);

    return this;
  }

  public gte(valueB: number, error: string): Validator<TValue> {
    this.append(
      (valueA) => greaterThanOrEqual(valueA as number, valueB),
      error,
    );

    return this;
  }

  public lt(valueB: number, error: string): Validator<TValue> {
    this.append((valueA) => lessThan(valueA as number, valueB), error);

    return this;
  }

  public lte(valueB: number, error: string): Validator<TValue> {
    this.append((valueA) => lessThanOrEqual(valueA as number, valueB), error);

    return this;
  }
}
