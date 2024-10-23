import { faker } from '@faker-js/faker';

import { Project, IProjectProps, ISkillProps } from '../../src';
import { Data } from './bases';
import { EntityBuilder } from './EntityBuilder';
import { SkillBuilder } from './SkillBuilder';

export class ProjectBuilder extends EntityBuilder<IProjectProps> {
  private constructor(props: IProjectProps) {
    super(props);
  }

  static build(): ProjectBuilder {
    return new ProjectBuilder({
      title: Data.text.title(),
      caption: Data.text.caption(),
      content: Data.text.text(),
      skills: SkillBuilder.listToProps(faker.number.int({ min: 0, max: 10 })),
    });
  }

  static list(count: number): Project[] {
    return [...Array(count)].map(() => ProjectBuilder.build().now());
  }

  public now(): Project {
    return new Project(this._props as IProjectProps);
  }

  public withTitle(title: string): ProjectBuilder {
    this._props.title = title;

    return this;
  }

  public withCaption(caption: string): ProjectBuilder {
    this._props.caption = caption;

    return this;
  }

  public withContent(content: string): ProjectBuilder {
    this._props.content = content;

    return this;
  }

  public withSkills(skills: ISkillProps[]): ProjectBuilder {
    this._props.skills = skills;

    return this;
  }

  public withoutTitle(): ProjectBuilder {
    this._props.title = undefined;

    return this;
  }

  public withoutCaption(): ProjectBuilder {
    this._props.caption = undefined;

    return this;
  }

  public withoutContent(): ProjectBuilder {
    this._props.content = undefined;

    return this;
  }

  public withoutSkills(): ProjectBuilder {
    this._props.skills = undefined;

    return this;
  }
}
