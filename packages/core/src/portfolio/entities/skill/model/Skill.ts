import {
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
    const descResult = Text.create(props.description);
    if (descResult.isLeft()) return left(descResult.value);

    const iconResult = Text.create(props.icon, { min: 2, max: 50 });
    if (iconResult.isLeft()) return left(iconResult.value);

    const typeResult = SkillType.create(props.type);
    if (typeResult.isLeft()) return left(typeResult.value);

    return right(
      new Skill(props, descResult.value, iconResult.value, typeResult.value),
    );
  }
}
