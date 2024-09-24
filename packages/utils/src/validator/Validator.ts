import { render } from 'mustache';

import {
  isAlpha,
  isDateTime,
  isEmpty,
  isLength,
  isNil,
  isString,
  isUUID,
  isUrl,
} from '../validations';

export type Validation = <TValue>(value: TValue) => boolean;
export class Validator {
  private readonly _validations: Array<[Validation, string]>;
  private _error: string | null = null;

  private constructor() {
    this._validations = [];
    this._error = null;
  }

  static new(): Validator {
    return new Validator();
  }

  private append(validation: Validation, error: string) {
    this._validations.push([validation, error]);

    return this;
  }

  public validate<TValue>(value: TValue) {
    for (const [validation, error] of this._validations) {
      const isValid = validation(value);

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

  public length(min: number, max: number, error: string): Validator {
    const config = { min, max };

    this.append(
      (value) => isLength(value as string, config),
      render(error, config),
    );

    return this;
  }

  public alpha(error: string): Validator {
    this.append((value) => isAlpha(value as string), error);

    return this;
  }

  public empty(error: string): Validator {
    this.append((value) => isEmpty(value as string), error);

    return this;
  }

  public nil(error: string): Validator {
    this.append((value) => isNil(value), error);

    return this;
  }

  public string(error: string): Validator {
    this.append((value) => isString(value), error);

    return this;
  }

  public uuid(error: string): Validator {
    this.append((value) => isUUID(value as string), error);

    return this;
  }

  public url(error: string): Validator {
    this.append((value) => isUrl(value as string), error);

    return this;
  }

  public datetime(error: string): Validator {
    this.append((value) => isDateTime(value as string), error);

    return this;
  }
}
