import { ISkillProps, Skill, SkillType } from '~/index';

import { EntityBuilder } from './EntityBuilder';

export class SkillBuilder extends EntityBuilder<ISkillProps> {
  private static readonly PRESETS: ReadonlyArray<ISkillProps> = [
    {
      description: 'TypeScript development',
      icon: 'code',
      type: SkillType.TECHNOLOGY,
    },
    {
      description: 'Team communication',
      icon: 'users',
      type: SkillType.SOFT,
    },
    {
      description: 'English language',
      icon: 'language',
      type: SkillType.LANGUAGE,
    },
  ];

  private constructor(props: ISkillProps) {
    super(props);
  }

  static build(): SkillBuilder {
    return new SkillBuilder(SkillBuilder.propsAt(0));
  }

  static list(count: number): Skill[] {
    return [...Array(count)].map((_, index) => {
      const result = Skill.create(SkillBuilder.propsAt(index));
      if (result.isLeft()) throw result.value;
      return result.value;
    });
  }

  static listToProps(count: number): ISkillProps[] {
    return [...Array(count)].map((_, index) => SkillBuilder.propsAt(index));
  }

  private static propsAt(index: number): ISkillProps {
    const preset = SkillBuilder.PRESETS[index % SkillBuilder.PRESETS.length]!;

    return { ...preset };
  }

  public now(): Skill {
    const result = Skill.create(this._props as ISkillProps);
    if (result.isLeft()) throw result.value;
    return result.value;
  }

  public withDescription(description: string): SkillBuilder {
    this._props.description = description;

    return this;
  }

  public withIcon(icon: string): SkillBuilder {
    this._props.icon = icon;

    return this;
  }

  public withType(type: SkillType): SkillBuilder {
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
