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
    if (!(SkillType.SKILLS as readonly string[]).includes(value))
      return left(
        new ValidationError({
          code: SkillType.ERROR_CODE,
          message: 'The value must be a valid skill type.',
        }),
      );

    return right(new SkillType(value));
  }
}
