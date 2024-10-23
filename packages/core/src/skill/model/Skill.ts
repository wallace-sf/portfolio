import {
  Entity,
  IEntityProps,
  SkillType,
  SkillTypeValue,
  Text,
} from '../../shared';

export interface ISkillProps extends IEntityProps {
  description: string;
  icon: string;
  type: SkillTypeValue;
}

export class Skill extends Entity<Skill, ISkillProps> {
  public readonly description: Text;
  public readonly icon: Text;
  public readonly type: SkillType;

  constructor(props: ISkillProps) {
    super(props);
    this.description = Text.new(props.description);
    this.icon = Text.new(props.icon, { min: 2, max: 50 });
    this.type = SkillType.new(props.type);
  }
}
