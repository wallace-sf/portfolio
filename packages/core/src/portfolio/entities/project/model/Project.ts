import { Validator } from '@repo/utils/validator';

import { ProjectStatus } from '~/portfolio/entities/project/model/ProjectStatus';
import {
  collect,
  DateRange,
  Either,
  AggregateRoot,
  Id,
  IEntityProps,
  ILocalizedTextInput,
  Image,
  LocalizedText,
  Slug,
  Text,
  ValidationError,
  left,
  right,
  validateEnum,
} from '~/shared';

export interface IProjectCoverImage {
  url: string;
  alt: ILocalizedTextInput;
}

export interface IProjectPeriod {
  start: string;
  end?: string;
}

export interface IProjectProps extends IEntityProps {
  slug: string;
  coverImage: IProjectCoverImage;
  title: ILocalizedTextInput;
  caption: ILocalizedTextInput;
  content: string;
  skills: string[];
  theme?: ILocalizedTextInput;
  summary?: ILocalizedTextInput;
  objectives?: ILocalizedTextInput;
  role?: ILocalizedTextInput;
  period: IProjectPeriod;
  featured: boolean;
  status: ProjectStatus;
  relatedProjects?: string[];
}

export class Project extends AggregateRoot<Project, IProjectProps> {
  static readonly ERROR_CODE = 'INVALID_PROJECT';

  public readonly slug: Slug;
  public readonly coverImage: Image;
  public readonly title: LocalizedText;
  public readonly caption: LocalizedText;
  public readonly content: Text;
  public readonly skills: Id[];
  public readonly theme: LocalizedText | undefined;
  public readonly summary: LocalizedText | undefined;
  public readonly objectives: LocalizedText | undefined;
  public readonly role: LocalizedText | undefined;
  public readonly period: DateRange;
  public readonly featured: boolean;
  public readonly status: ProjectStatus;
  public readonly relatedProjects: Slug[];

  private constructor(
    props: IProjectProps,
    status: ProjectStatus,
    slug: Slug,
    coverImage: Image,
    title: LocalizedText,
    caption: LocalizedText,
    content: Text,
    skills: Id[],
    theme: LocalizedText | undefined,
    summary: LocalizedText | undefined,
    objectives: LocalizedText | undefined,
    role: LocalizedText | undefined,
    period: DateRange,
    relatedProjects: Slug[],
  ) {
    super(props);
    this.status = status;
    this.slug = slug;
    this.coverImage = coverImage;
    this.title = title;
    this.caption = caption;
    this.content = content;
    this.skills = skills;
    this.theme = theme;
    this.summary = summary;
    this.objectives = objectives;
    this.role = role;
    this.period = period;
    this.featured = props.featured;
    this.relatedProjects = relatedProjects;
  }

  static create(props: IProjectProps): Either<ValidationError, Project> {
    const fieldsResult = collect([
      validateEnum(
        props.status,
        Object.values(ProjectStatus),
        Project.ERROR_CODE,
        `Status must be one of: ${Object.values(ProjectStatus).join(', ')}.`,
      ),
      Slug.create(props.slug),
      Image.create(props.coverImage?.url, props.coverImage?.alt),
      LocalizedText.create(props.title ?? { 'pt-BR': '' }),
      LocalizedText.create(props.caption ?? { 'pt-BR': '' }),
      Text.create(props.content, { min: 3, max: 500000 }),
      DateRange.create(props.period?.start, props.period?.end),
      props.theme
        ? LocalizedText.create(props.theme)
        : right<ValidationError, LocalizedText | undefined>(undefined),
      props.summary
        ? LocalizedText.create(props.summary)
        : right<ValidationError, LocalizedText | undefined>(undefined),
      props.objectives
        ? LocalizedText.create(props.objectives)
        : right<ValidationError, LocalizedText | undefined>(undefined),
      props.role
        ? LocalizedText.create(props.role)
        : right<ValidationError, LocalizedText | undefined>(undefined),
    ]);
    if (fieldsResult.isLeft()) return left(fieldsResult.value);

    const [
      status,
      slug,
      coverImage,
      title,
      caption,
      content,
      period,
      theme,
      summary,
      objectives,
      role,
    ] = fieldsResult.value;

    const skills: Id[] = [];
    for (const skillId of props.skills ?? []) {
      const idResult = Id.create(skillId);
      if (idResult.isLeft()) return left(idResult.value);
      skills.push(idResult.value);
    }

    const relatedResult = collect(
      (props.relatedProjects ?? []).map((s) => Slug.create(s)),
    );
    if (relatedResult.isLeft()) return left(relatedResult.value);

    const relatedSlugs = relatedResult.value as Slug[];
    const ownSlugValue = slug.value;

    {
      const { error, isValid } = Validator.of(relatedSlugs)
        .refine(
          (slugs) => !slugs.some((s) => s.value === ownSlugValue),
          'A project cannot reference itself as a related project.',
        )
        .refine((slugs) => {
          const values = slugs.map((s) => s.value);
          return new Set(values).size === values.length;
        }, 'Related projects must not contain duplicate slugs.')
        .validate();
      if (!isValid && error)
        return left(
          new ValidationError({ code: Project.ERROR_CODE, message: error }),
        );
    }

    return right(
      new Project(
        props,
        status,
        slug,
        coverImage,
        title,
        caption,
        content,
        skills,
        theme as LocalizedText | undefined,
        summary as LocalizedText | undefined,
        objectives as LocalizedText | undefined,
        role as LocalizedText | undefined,
        period,
        relatedSlugs,
      ),
    );
  }
}
