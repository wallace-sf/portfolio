import { Validator } from '@repo/utils/validator';

import {
  collect,
  Either,
  AggregateRoot,
  IEntityProps,
  left,
  right,
  Text,
  ValidationError,
} from '../../../../shared';
import { SkillType } from './SkillType';

export interface ISkillProps extends IEntityProps {
  description: string;
  icon: string;
  type: SkillType;
}

export class Skill extends AggregateRoot<Skill, ISkillProps> {
  public readonly description: Text;
  public readonly icon: Text;
  public readonly type: SkillType;

  private constructor(props: ISkillProps, description: Text, icon: Text) {
    super(props);
    this.description = description;
    this.icon = icon;
    this.type = props.type;
  }

  static create(props: ISkillProps): Either<ValidationError, Skill> {
    const { error: typeError, isValid: typeValid } = Validator.of(props.type)
      .in(Object.values(SkillType), 'Invalid skill type.')
      .validate();
    if (!typeValid && typeError)
      return left(
        new ValidationError({ code: 'INVALID_SKILL_TYPE', message: typeError }),
      );

    const result = collect([
      Text.create(props.description),
      Text.create(props.icon, { min: 2, max: 50 }),
    ]);
    if (result.isLeft()) return left(result.value);

    const [description, icon] = result.value;
    return right(new Skill(props, description, icon));
  }
}
