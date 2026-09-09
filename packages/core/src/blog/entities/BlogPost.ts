import { Validator } from '@repo/utils/validator';

import {
  collect,
  Either,
  AggregateRoot,
  IEntityProps,
  Image,
  ILocalizedTextInput,
  LocalizedText,
  DateTime,
  Slug,
  ValidationError,
  left,
  right,
} from '../../shared';
import { Tag } from '../value-objects/Tag';
import { BlogPostStatus } from './BlogPostStatus';

export interface IBlogPostImage {
  url: string;
  alt: ILocalizedTextInput;
}

export interface IBlogPostProps extends IEntityProps {
  slug: string;
  title: ILocalizedTextInput;
  description: ILocalizedTextInput;
  content: ILocalizedTextInput;
  tags: string[];
  publishedAt: string;
  status?: BlogPostStatus;
  featured?: boolean;
  coverImage?: IBlogPostImage;
  thumbnailImage?: IBlogPostImage;
}

export class BlogPost extends AggregateRoot<BlogPost, IBlogPostProps> {
  static readonly ERROR_CODE = 'INVALID_BLOG_POST';

  public readonly slug: Slug;
  public readonly title: LocalizedText;
  public readonly description: LocalizedText;
  public readonly content: LocalizedText;
  public readonly tags: Tag[];
  public readonly publishedAt: DateTime;
  /** Mutable only through `publish()` / `archive()` — no external setter, like `Project.status`. */
  public status: BlogPostStatus;
  public readonly featured: boolean;
  public readonly coverImage: Image | undefined;
  public readonly thumbnailImage: Image | undefined;

  private constructor(
    props: IBlogPostProps,
    slug: Slug,
    title: LocalizedText,
    description: LocalizedText,
    content: LocalizedText,
    tags: Tag[],
    publishedAt: DateTime,
    status: BlogPostStatus,
    featured: boolean,
    coverImage: Image | undefined,
    thumbnailImage: Image | undefined,
  ) {
    super(props);
    this.slug = slug;
    this.title = title;
    this.description = description;
    this.content = content;
    this.tags = tags;
    this.publishedAt = publishedAt;
    this.status = status;
    this.featured = featured;
    this.coverImage = coverImage;
    this.thumbnailImage = thumbnailImage;
  }

  static create(props: IBlogPostProps): Either<ValidationError, BlogPost> {
    const fieldsResult = collect([
      Slug.create(props.slug),
      LocalizedText.create(props.title ?? { 'en-US': '' }),
      LocalizedText.create(props.description ?? { 'en-US': '' }),
      LocalizedText.create(props.content ?? { 'en-US': '' }),
      DateTime.create(props.publishedAt),
      props.coverImage
        ? Image.create(props.coverImage.url, props.coverImage.alt)
        : right<ValidationError, Image | undefined>(undefined),
      props.thumbnailImage
        ? Image.create(props.thumbnailImage.url, props.thumbnailImage.alt)
        : right<ValidationError, Image | undefined>(undefined),
    ]);
    if (fieldsResult.isLeft()) return left(fieldsResult.value);

    const [
      slug,
      title,
      description,
      content,
      publishedAt,
      coverImage,
      thumbnailImage,
    ] = fieldsResult.value;

    const { isValid } = Validator.of(title)
      .refine((t) => t.hasAllLocales())
      .refine(() => description.hasAllLocales())
      .refine(() => content.hasAllLocales())
      .validate();
    if (!isValid)
      return left(new ValidationError({ code: BlogPost.ERROR_CODE }));

    const tagsResult = collect((props.tags ?? []).map((t) => Tag.create(t)));
    if (tagsResult.isLeft()) return left(tagsResult.value);
    const tags = tagsResult.value as Tag[];

    const status = props.status ?? BlogPostStatus.DRAFT;
    const featured = props.featured ?? false;

    {
      const { isValid } = Validator.of(status)
        .in(Object.values(BlogPostStatus))
        .refine((s) => s !== BlogPostStatus.PUBLISHED || tags.length > 0)
        .validate();
      if (!isValid)
        return left(new ValidationError({ code: BlogPost.ERROR_CODE }));
    }

    return right(
      new BlogPost(
        props,
        slug,
        title,
        description,
        content,
        tags,
        publishedAt,
        status,
        featured,
        coverImage as Image | undefined,
        thumbnailImage as Image | undefined,
      ),
    );
  }

  /**
   * Chronological order of publication: the post published earlier sorts first.
   * This is the domain's definition of "before/after" for posts; callers pick
   * the direction they present it in.
   */
  static compareByPublication(a: BlogPost, b: BlogPost): number {
    return a.publishedAt.ms - b.publishedAt.ms;
  }
}
