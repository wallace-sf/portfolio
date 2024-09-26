import { Validator, ValidationError } from '@repo/utils';

import { ValueObject } from '../base/ValueObject';

export type SkillValue = Readonly<typeof SkillType.SKILLS>[number];

export class SkillType extends ValueObject<SkillValue> {
  static readonly ERROR_CODE = 'ERROR_INVALID_SKILL_TYPE';
  static readonly SKILLS = [
    'EDUCATION',
    'TECHNOLOGY',
    'LANGUAGE',
    'SOFT',
    'OTHER',
  ] as const;

  private constructor(value: SkillValue) {
    super({ value, isNew: false });
    this._validate(value);
  }

  static new(value: SkillValue): SkillType {
    return new SkillType(value);
  }

  private _validate(value: string): void {
    const { error, isValid } = Validator.new()
      .in(
        [...SkillType.SKILLS],
        'O valor deve ser um tipo de habilidade válido.',
      )
      .validate(value);

    const ERROR_CODE = SkillType.ERROR_CODE;

    if (!isValid && error) throw new ValidationError(ERROR_CODE, error);
  }
}
