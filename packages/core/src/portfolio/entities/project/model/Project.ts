import { Validator } from '@repo/utils/validator';

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
  ValidationError,
  left,
  right,
  validateEnum,
} from '../../../../shared';
import { ProjectStatus } from './ProjectStatus';

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
  thumbnailImage: IProjectCoverImage;
  title: ILocalizedTextInput;
  caption: ILocalizedTextInput;
  content: ILocalizedTextInput;
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
  public readonly thumbnailImage: Image;
  public readonly title: LocalizedText;
  public readonly caption: LocalizedText;
  public readonly content: LocalizedText;
  public readonly skills: Id[];
  public readonly theme: LocalizedText | undefined;
  public readonly summary: LocalizedText | undefined;
  public readonly objectives: LocalizedText | undefined;
  public readonly role: LocalizedText | undefined;
  public readonly period: DateRange;
  public readonly featured: boolean;
  public status: ProjectStatus;
  public readonly relatedProjects: Slug[];

  private constructor(
    props: IProjectProps,
    status: ProjectStatus,
    slug: Slug,
    coverImage: Image,
    thumbnailImage: Image,
    title: LocalizedText,
    caption: LocalizedText,
    content: LocalizedText,
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
    this.thumbnailImage = thumbnailImage;
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
    {
      const { isValid } = Validator.of(props.status)
        .in(Object.values(ProjectStatus))
        .validate();
      if (!isValid)
        return left(new ValidationError({ code: Project.ERROR_CODE }));
    }

    const fieldsResult = collect([
      validateEnum(
        props.status,
        Object.values(ProjectStatus),
        Project.ERROR_CODE,
      ),
      Slug.create(props.slug),
      Image.create(props.coverImage?.url, props.coverImage?.alt),
      Image.create(props.thumbnailImage?.url, props.thumbnailImage?.alt),
      LocalizedText.create(props.title ?? { 'pt-BR': '' }),
      LocalizedText.create(props.caption ?? { 'pt-BR': '' }),
      LocalizedText.create(props.content ?? { 'en-US': '' }),
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
      thumbnailImage,
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
      const { isValid } = Validator.of(relatedSlugs)
        .refine((slugs) => !slugs.some((s) => s.value === ownSlugValue))
        .refine((slugs) => {
          const values = slugs.map((s) => s.value);
          return new Set(values).size === values.length;
        })
        .validate();
      if (!isValid)
        return left(new ValidationError({ code: Project.ERROR_CODE }));
    }

    return right(
      new Project(
        props,
        status,
        slug,
        coverImage,
        thumbnailImage,
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

  publish(): Either<ValidationError, void> {
    const { isValid } = Validator.of(this.status)
      .refine((s) => s !== ProjectStatus.PUBLISHED)
      .validate();
    if (!isValid)
      return left(new ValidationError({ code: Project.ERROR_CODE }));
    this.status = ProjectStatus.PUBLISHED;
    return right(undefined);
  }

  archive(): Either<ValidationError, void> {
    const { isValid } = Validator.of(this.status)
      .refine((s) => s !== ProjectStatus.ARCHIVED)
      .validate();
    if (!isValid)
      return left(new ValidationError({ code: Project.ERROR_CODE }));
    this.status = ProjectStatus.ARCHIVED;
    return right(undefined);
  }
}
