import {
  ILocalizedTextInput,
  IProjectCoverImage,
  IProjectPeriod,
  IProjectProps,
  ISkillProps,
  Project,
  ProjectStatus,
} from '../../src';
import { Data } from './bases';
import { EntityBuilder } from './EntityBuilder';
import { SkillBuilder } from './SkillBuilder';

export class ProjectBuilder extends EntityBuilder<IProjectProps> {
  private constructor(props: IProjectProps) {
    super(props);
  }

  static build(): ProjectBuilder {
    return new ProjectBuilder({
      slug: Data.slug.valid(),
      coverImage: { url: Data.image.url(), alt: Data.image.alt() },
      title: { 'pt-BR': Data.text.title() },
      caption: { 'pt-BR': Data.text.caption() },
      content: Data.text.text(),
      skills: SkillBuilder.listToProps(2),
      period: { start: '2024-01-01' },
      featured: false,
      status: ProjectStatus.DRAFT,
      relatedProjects: [],
    });
  }

  static list(count: number): Project[] {
    return [...Array(count)].map(() => ProjectBuilder.build().now());
  }

  public now(): Project {
    const result = Project.create(this._props as IProjectProps);
    if (result.isLeft()) throw result.value;
    return result.value;
  }

  public withSlug(slug: string): ProjectBuilder {
    this._props.slug = slug;
    return this;
  }

  public withCoverImage(coverImage: IProjectCoverImage): ProjectBuilder {
    this._props.coverImage = coverImage;
    return this;
  }

  public withTitle(title: ILocalizedTextInput): ProjectBuilder {
    this._props.title = title;
    return this;
  }

  public withCaption(caption: ILocalizedTextInput): ProjectBuilder {
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

  public withTheme(theme: ILocalizedTextInput): ProjectBuilder {
    this._props.theme = theme;
    return this;
  }

  public withSummary(summary: ILocalizedTextInput): ProjectBuilder {
    this._props.summary = summary;
    return this;
  }

  public withObjectives(objectives: ILocalizedTextInput): ProjectBuilder {
    this._props.objectives = objectives;
    return this;
  }

  public withRole(role: ILocalizedTextInput): ProjectBuilder {
    this._props.role = role;
    return this;
  }

  public withTeam(team: string): ProjectBuilder {
    this._props.team = team;
    return this;
  }

  public withPeriod(period: IProjectPeriod): ProjectBuilder {
    this._props.period = period;
    return this;
  }

  public withFeatured(featured: boolean): ProjectBuilder {
    this._props.featured = featured;
    return this;
  }

  public withStatus(status: ProjectStatus): ProjectBuilder {
    this._props.status = status;
    return this;
  }

  public withRelatedProjects(relatedProjects: string[]): ProjectBuilder {
    this._props.relatedProjects = relatedProjects;
    return this;
  }

  public withoutSlug(): ProjectBuilder {
    this._props.slug = undefined;
    return this;
  }

  public withoutCoverImage(): ProjectBuilder {
    this._props.coverImage = undefined;
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

  public withoutPeriod(): ProjectBuilder {
    this._props.period = undefined;
    return this;
  }
}
