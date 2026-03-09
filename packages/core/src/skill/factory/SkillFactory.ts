import { ValidationError } from '../../shared';
import { ISkillProps, Skill } from '../model';

export class SkillFactory {
  static readonly ERROR_CODE = 'ERROR_INVALID_SKILL_LIST';

  public static bulk(props: ISkillProps[]): Skill[] {
    if (!Array.isArray(props)) {
      throw new ValidationError({
        code: SkillFactory.ERROR_CODE,
        message: 'Skills must be provided as an array.',
      });
    }

    return props.map((p) => new Skill(p));
  }
}
