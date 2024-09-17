import { ValueObject } from '../base/ValueObject';

export enum TechnologyTypeEnum {
  DATABASE = 'DATABASE',
  FRAMEWORK = 'FRAMEWORK',
  LIBRARY = 'LIBRARY',
  METHOLOGY = 'METHODOLOGY',
  OPERATION_SYSTEM = 'OPERATION_SYSTEM',
  PLATFORM = 'PLATFORM',
  PROGRAMMING_LANGUAGE = 'PROGRAMMING_LANGUAGE',
  TESTING = 'TESTING',
  TOOL = 'TOOL',
}

export class TechnologyType extends ValueObject<TechnologyTypeEnum> {
  static readonly ERROR_INVALID_TECHNOLOGY_TYPE =
    'ERROR_INVALID_TECHNOLOGY_TYPE';

  private constructor(value: TechnologyTypeEnum) {
    super({ value: value, isNew: value == null });
    this._validate(this._props.value);
  }

  static new(value: TechnologyTypeEnum): TechnologyType {
    return new TechnologyType(value);
  }

  static isValid(value: TechnologyTypeEnum): boolean {
    return Object.values(TechnologyTypeEnum).includes(value);
  }

  private _validate(value: TechnologyTypeEnum): void {
    const isValid = TechnologyType.isValid(value);

    if (!isValid) throw new Error(TechnologyType.ERROR_INVALID_TECHNOLOGY_TYPE);
  }
}
