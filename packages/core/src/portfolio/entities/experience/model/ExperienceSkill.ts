import {
  collect,
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
    const result = collect([
      Skill.create(props.skill),
      LocalizedText.create(props.workDescription ?? { 'pt-BR': '' }),
    ]);
    if (result.isLeft()) return left(result.value);

    const [skill, workDescription] = result.value;
    return right(new ExperienceSkill(skill, workDescription));
  }

  get skill(): Skill {
    return this.value.skill;
  }

  get workDescription(): LocalizedText {
    return this.value.workDescription;
  }
}
