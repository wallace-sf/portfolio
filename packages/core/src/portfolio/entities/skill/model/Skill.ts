import {
  collect,
  Either,
  Entity,
  IEntityProps,
  left,
  right,
  SkillType,
  SkillTypeValue,
  Text,
  ValidationError,
} from '../../../../shared';

export interface ISkillProps extends IEntityProps {
  description: string;
  icon: string;
  type: SkillTypeValue;
}

export class Skill extends Entity<Skill, ISkillProps> {
  public readonly description: Text;
  public readonly icon: Text;
  public readonly type: SkillType;

  private constructor(
    props: ISkillProps,
    description: Text,
    icon: Text,
    type: SkillType,
  ) {
    super(props);
    this.description = description;
    this.icon = icon;
    this.type = type;
  }

  static create(props: ISkillProps): Either<ValidationError, Skill> {
    const result = collect([
      Text.create(props.description),
      Text.create(props.icon, { min: 2, max: 50 }),
      SkillType.create(props.type),
    ]);
    if (result.isLeft()) return left(result.value);

    const [description, icon, type] = result.value;
    return right(new Skill(props, description, icon, type));
  }
}
