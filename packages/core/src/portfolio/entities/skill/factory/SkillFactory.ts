import { Validator } from '@repo/utils/validator';

import { Either, left, right, ValidationError } from '../../../../shared';
import { ISkillProps, Skill } from '../model/Skill';

export class SkillFactory {
  static readonly ERROR_CODE = 'ERROR_INVALID_SKILL_LIST';

  static bulk(props: ISkillProps[]): Either<ValidationError, Skill[]> {
    const { isValid } = Validator.of(props).refine(Array.isArray).validate();

    if (!isValid)
      return left(new ValidationError({ code: SkillFactory.ERROR_CODE }));

    const skills: Skill[] = [];

    for (let i = 0; i < props.length; i++) {
      const result = Skill.create(props[i]!);
      if (result.isLeft()) return left(result.value);
      skills.push(result.value);
    }

    return right(skills);
  }
}
