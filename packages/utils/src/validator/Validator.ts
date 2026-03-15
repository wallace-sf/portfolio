import { DateTime as LuxonDateTime } from 'luxon';
import Mustache from 'mustache';
import { z } from 'zod';

const ALPHA_REGEX = /^[A-ZÃÁÀÂÄÇÉÊËÍÏÕÓÔÖÚÜ\s]+$/i;

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

  static of<TValue>(value: TValue): Validator<TValue> {
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
      (value) => z.string().min(min).max(max).safeParse(value).success,
      Mustache.render(error, config),
    );

    return this;
  }

  public alpha(error: string): Validator<TValue> {
    this.append(
      (value) => z.string().regex(ALPHA_REGEX).safeParse(value).success,
      error,
    );

    return this;
  }

  public empty(error: string): Validator<TValue> {
    this.append(
      (value) => z.string().max(0).safeParse(value).success,
      error,
    );

    return this;
  }

  public notEmpty(error: string): Validator<TValue> {
    this.append(
      (value) => z.string().min(1).safeParse(value).success,
      error,
    );

    return this;
  }

  public nil(error: string): Validator<TValue> {
    this.append((value) => value == null, error);

    return this;
  }

  public notNil(error: string): Validator<TValue> {
    this.append((value) => value != null, error);

    return this;
  }

  public string(error: string): Validator<TValue> {
    this.append((value) => z.string().safeParse(value).success, error);

    return this;
  }

  public uuid(error: string): Validator<TValue> {
    this.append((value) => z.string().uuid().safeParse(value).success, error);

    return this;
  }

  public url(error: string): Validator<TValue> {
    this.append((value) => z.string().url().safeParse(value).success, error);

    return this;
  }

  public datetime(error: string): Validator<TValue> {
    this.append(
      (value) =>
        z.string().safeParse(value).success &&
        LuxonDateTime.fromISO(value as string).isValid,
      error,
    );

    return this;
  }

  public in(values: string[], error: string): Validator<TValue> {
    this.append(
      (value) =>
        z.string().safeParse(value).success &&
        values.includes(value as string),
      error,
    );

    return this;
  }

  public gt(valueB: number, error: string): Validator<TValue> {
    this.append(
      (value) => z.number().gt(valueB).safeParse(value).success,
      error,
    );

    return this;
  }

  public gte(valueB: number, error: string): Validator<TValue> {
    this.append(
      (value) => z.number().gte(valueB).safeParse(value).success,
      error,
    );

    return this;
  }

  public lt(valueB: number, error: string): Validator<TValue> {
    this.append(
      (value) => z.number().lt(valueB).safeParse(value).success,
      error,
    );

    return this;
  }

  public lte(valueB: number, error: string): Validator<TValue> {
    this.append(
      (value) => z.number().lte(valueB).safeParse(value).success,
      error,
    );

    return this;
  }

  public regex(pattern: RegExp, error: string): Validator<TValue> {
    this.append(
      (value) => z.string().regex(pattern).safeParse(value).success,
      error,
    );

    return this;
  }

  public refine(
    predicate: (value: TValue) => boolean,
    error: string,
  ): Validator<TValue> {
    this.append((value) => predicate(value as unknown as TValue), error);

    return this;
  }
}
