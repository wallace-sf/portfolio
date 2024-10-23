import { ISkillProps, Skill, SkillTypeValue } from '../../src';
import { Data } from './bases';
import { EntityBuilder } from './EntityBuilder';

export class SkillBuilder extends EntityBuilder<ISkillProps> {
  private constructor(props: ISkillProps) {
    super(props);
  }

  static build(): SkillBuilder {
    return new SkillBuilder({
      description: Data.text.description(),
      icon: Data.text.icon(),
      type: Data.skill.valid(),
    });
  }

  static list(count: number): Skill[] {
    return [...Array(count)].map(() => SkillBuilder.build().now());
  }

  static listToProps(count: number): ISkillProps[] {
    return [...Array(count)].map(() => SkillBuilder.build().toProps());
  }

  public now(): Skill {
    return new Skill(this._props as ISkillProps);
  }

  public withDescription(description: string): SkillBuilder {
    this._props.description = description;

    return this;
  }

  public withIcon(icon: string): SkillBuilder {
    this._props.icon = icon;

    return this;
  }

  public withType(type: SkillTypeValue): SkillBuilder {
    this._props.type = type;

    return this;
  }

  public withoutDescription(): SkillBuilder {
    this._props.description = undefined;

    return this;
  }

  public withoutIcon(): SkillBuilder {
    this._props.icon = undefined;

    return this;
  }

  public withoutType(): SkillBuilder {
    this._props.type = undefined;

    return this;
  }
}
