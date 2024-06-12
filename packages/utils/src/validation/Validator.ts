export type Validation = () => string | null;

export class Validator {
  private readonly _validations: Validation[];
  private _error: string | null = null;

  private constructor() {
    this._validations = [];
    this._error = null;
  }

  static new(): Validator {
    return new Validator();
  }

  public push(validation: Validation): Validator {
    this._validations.push(validation);

    return this;
  }

  public validate() {
    for (const validation of this._validations) {
      const error = validation();

      this._error = error;

      if (this._error) break;
    }

    return this;
  }

  get error(): string | null {
    return this._error;
  }

  get isValid(): boolean {
    return this._error == null;
  }
}
