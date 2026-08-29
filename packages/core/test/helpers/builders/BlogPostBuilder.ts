import { BlogPost, IBlogPostProps, ILocalizedTextInput } from '~/index';

import { Data } from '../generators';
import { EntityBuilder } from './EntityBuilder';

export class BlogPostBuilder extends EntityBuilder<IBlogPostProps> {
  private constructor(props: IBlogPostProps) {
    super(props);
  }

  static build(): BlogPostBuilder {
    return new BlogPostBuilder({
      slug: Data.slug.valid(),
      title: {
        'en-US': Data.text.title(),
        'pt-BR': Data.text.title(),
        es: Data.text.title(),
      },
      description: {
        'en-US': Data.text.description(),
        'pt-BR': Data.text.description(),
        es: Data.text.description(),
      },
      content: {
        'en-US': Data.text.text(),
        'pt-BR': Data.text.text(),
        es: Data.text.text(),
      },
      tags: ['nextjs', 'architecture'],
      publishedAt: '2026-08-01T00:00:00.000Z',
    });
  }

  static list(count: number): BlogPost[] {
    return [...Array(count)].map(() => BlogPostBuilder.build().now());
  }

  public now(): BlogPost {
    const result = BlogPost.create(this._props as IBlogPostProps);
    if (result.isLeft()) throw result.value;
    return result.value;
  }

  public withSlug(slug: string): BlogPostBuilder {
    this._props.slug = slug;
    return this;
  }

  public withTitle(title: ILocalizedTextInput): BlogPostBuilder {
    this._props.title = title;
    return this;
  }

  public withDescription(description: ILocalizedTextInput): BlogPostBuilder {
    this._props.description = description;
    return this;
  }

  public withContent(content: ILocalizedTextInput): BlogPostBuilder {
    this._props.content = content;
    return this;
  }

  public withTags(tags: string[]): BlogPostBuilder {
    this._props.tags = tags;
    return this;
  }

  public withPublishedAt(publishedAt: string): BlogPostBuilder {
    this._props.publishedAt = publishedAt;
    return this;
  }

  public withCoverImage(
    coverImage: IBlogPostProps['coverImage'],
  ): BlogPostBuilder {
    this._props.coverImage = coverImage;
    return this;
  }

  public withThumbnailImage(
    thumbnailImage: IBlogPostProps['thumbnailImage'],
  ): BlogPostBuilder {
    this._props.thumbnailImage = thumbnailImage;
    return this;
  }
}
