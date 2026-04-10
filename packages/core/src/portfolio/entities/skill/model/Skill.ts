import {
  collect,
  Either,
  AggregateRoot,
  IEntityProps,
  left,
  right,
  Text,
  ValidationError,
  validateEnum,
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

  private constructor(
    props: ISkillProps,
    type: SkillType,
    description: Text,
    icon: Text,
  ) {
    super(props);
    this.type = type;
    this.description = description;
    this.icon = icon;
  }

  static create(props: ISkillProps): Either<ValidationError, Skill> {
    const result = collect([
      validateEnum(
        props.type,
        Object.values(SkillType),
        'INVALID_SKILL_TYPE',
        'Invalid skill type.',
      ),
      Text.create(props.description),
      Text.create(props.icon, { min: 2, max: 50 }),
    ]);
    if (result.isLeft()) return left(result.value);

    const [type, description, icon] = result.value;
    return right(new Skill(props, type, description, icon));
  }
}
