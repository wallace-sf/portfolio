import { Validator } from '@repo/utils';

import { ValueObject } from '../base/ValueObject';
import { left, right, Either } from '../either';
import { ValidationError } from '../errors';

export type SkillTypeValue = Readonly<typeof SkillType.SKILLS>[number];

export class SkillType extends ValueObject<SkillTypeValue> {
  static readonly ERROR_CODE = 'INVALID_SKILL_TYPE';
  static readonly SKILLS = [
    'EDUCATION',
    'TECHNOLOGY',
    'LANGUAGE',
    'SOFT',
    'OTHER',
  ] as const;

  private constructor(value: SkillTypeValue) {
    super({ value });
  }

  static create(value: SkillTypeValue): Either<ValidationError, SkillType> {
    const { error, isValid } = Validator.new(value)
      .in([...SkillType.SKILLS], 'The value must be a valid skill type.')
      .validate();

    if (!isValid && error)
      return left(
        new ValidationError({ code: SkillType.ERROR_CODE, message: error }),
      );

    return right(new SkillType(value));
  }

  /** @deprecated Use SkillType.create() instead */
  static new(value: SkillTypeValue): SkillType {
    const result = SkillType.create(value);
    if (result.isLeft()) throw result.value;
    return result.value;
  }
}
