import {
  Either,
  ILocalizedTextInput,
  LocalizedText,
  ValueObject,
  ValidationError,
  left,
  right,
} from '../../../../shared';
import { ISkillProps, Skill } from '../../skill';

export interface IExperienceSkillProps {
  skill: ISkillProps;
  workDescription: ILocalizedTextInput;
}

interface IExperienceSkillValue {
  skill: Skill;
  workDescription: LocalizedText;
}

export class ExperienceSkill extends ValueObject<IExperienceSkillValue> {
  static readonly ERROR_CODE = 'INVALID_EXPERIENCE_SKILL';

  private constructor(skill: Skill, workDescription: LocalizedText) {
    super({ value: { skill, workDescription } });
  }

  static create(
    props: IExperienceSkillProps,
  ): Either<ValidationError, ExperienceSkill> {
    const skillResult = Skill.create(props.skill);
    if (skillResult.isLeft()) return left(skillResult.value);

    const workDescResult = LocalizedText.create(
      props.workDescription ?? { 'pt-BR': '' },
    );
    if (workDescResult.isLeft()) return left(workDescResult.value);

    return right(new ExperienceSkill(skillResult.value, workDescResult.value));
  }

  get skill(): Skill {
    return this.value.skill;
  }

  get workDescription(): LocalizedText {
    return this.value.workDescription;
  }
}
