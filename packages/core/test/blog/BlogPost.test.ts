import {
  Author,
  BlogPost,
  BlogPostStatus,
  DateTime,
  Image,
  ILocalizedTextInput,
  LocalizedText,
  PersonName,
  Slug,
  Tag,
  Url,
  ValidationError,
} from '~/index';

import { BlogPostBuilder } from '../helpers';

const validAlt = {
  'en-US': 'Cover',
  'pt-BR': 'Capa',
  es: 'Portada',
};

describe('BlogPost', () => {
  describe('when created from valid props', () => {
    it('should return Right with a valid BlogPost', () => {
      const result = BlogPost.create(BlogPostBuilder.build().toProps());

      expect(result.isRight()).toBe(true);
      expect(result.value).toBeInstanceOf(BlogPost);
    });

    it('should create BlogPost with all fields as VOs', () => {
      const result = BlogPost.create(
        BlogPostBuilder.build()
          .withTitle({ 'en-US': 'My First Post', 'pt-BR': 'x', es: 'x' })
          .toProps(),
      );

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.slug).toBeInstanceOf(Slug);
      expect(result.value.title).toBeInstanceOf(LocalizedText);
      expect(result.value.description).toBeInstanceOf(LocalizedText);
      expect(result.value.content).toBeInstanceOf(LocalizedText);
      expect(result.value.tags).toHaveLength(2);
      expect(result.value.tags[0]).toBeInstanceOf(Tag);
      expect(result.value.title.get('en-US')).toBe('My First Post');
    });

    it('should create BlogPost without a coverImage or thumbnailImage', () => {
      const result = BlogPost.create(BlogPostBuilder.build().toProps());

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.coverImage).toBeUndefined();
      expect(result.value.thumbnailImage).toBeUndefined();
    });

    it('should create BlogPost with a coverImage as an Image VO', () => {
      const result = BlogPost.create(
        BlogPostBuilder.build()
          .withCoverImage({
            url: 'https://example.com/cover.png',
            alt: validAlt,
          })
          .toProps(),
      );

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.coverImage).toBeInstanceOf(Image);
      expect(result.value.coverImage?.url.value).toBe(
        'https://example.com/cover.png',
      );
      expect(result.value.coverImage?.alt.get('pt-BR')).toBe('Capa');
    });

    it('should create BlogPost with both cover and thumbnail Image VOs', () => {
      const result = BlogPost.create(
        BlogPostBuilder.build()
          .withCoverImage({
            url: 'https://example.com/cover.png',
            alt: validAlt,
          })
          .withThumbnailImage({
            url: 'https://example.com/thumb.png',
            alt: validAlt,
          })
          .toProps(),
      );

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.coverImage).toBeInstanceOf(Image);
      expect(result.value.thumbnailImage).toBeInstanceOf(Image);
      expect(result.value.thumbnailImage?.url.value).toBe(
        'https://example.com/thumb.png',
      );
    });

    it('should create BlogPost with an empty tags list', () => {
      const result = BlogPost.create(
        BlogPostBuilder.build().withTags([]).toProps(),
      );

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.tags).toHaveLength(0);
    });

    it('should default to an empty tags list when tags is undefined', () => {
      const result = BlogPost.create(
        BlogPostBuilder.build()
          .withTags(undefined as unknown as string[])
          .toProps(),
      );

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.tags).toHaveLength(0);
    });

    it('should create BlogPost with author as an Author VO', () => {
      const result = BlogPost.create(BlogPostBuilder.build().toProps());

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.author).toBeInstanceOf(Author);
      expect(result.value.author.name.value).toBe('Wallace Ferreira');
    });

    it('should create BlogPost with custom author', () => {
      const result = BlogPost.create(
        BlogPostBuilder.build()
          .withAuthor({
            name: 'John Doe',
            avatarUrl: 'https://example.com/avatar.jpg',
            url: 'https://johndoe.dev',
          })
          .toProps(),
      );

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.author.name.value).toBe('John Doe');
      expect(result.value.author.avatarUrl.value).toBe(
        'https://example.com/avatar.jpg',
      );
      expect(result.value.author.url?.value).toBe('https://johndoe.dev');
    });
  });

  describe('when created from invalid props', () => {
    it('should return Left for an invalid slug', () => {
      const result = BlogPost.create(
        BlogPostBuilder.build().withSlug('Not A Slug').toProps(),
      );

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(ValidationError);
    });

    it('should return Left for a missing publishedAt', () => {
      const result = BlogPost.create(
        BlogPostBuilder.build()
          .withPublishedAt(undefined as unknown as string)
          .toProps(),
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(DateTime.ERROR_CODE);
    });

    it('should return Left for an invalid publishedAt', () => {
      const result = BlogPost.create(
        BlogPostBuilder.build().withPublishedAt('not-a-date').toProps(),
      );

      expect(result.isLeft()).toBe(true);
    });

    it('should return Left when title is missing the pt-BR locale', () => {
      const result = BlogPost.create(
        BlogPostBuilder.build()
          .withTitle({ 'en-US': 'My First Post', es: 'Mi Primer Post' })
          .toProps(),
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(BlogPost.ERROR_CODE);
    });

    it('should return Left when title is undefined', () => {
      const result = BlogPost.create(
        BlogPostBuilder.build()
          .withTitle(undefined as unknown as ILocalizedTextInput)
          .toProps(),
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(
        LocalizedText.ERROR_CODE,
      );
    });

    it('should return Left when description is undefined', () => {
      const result = BlogPost.create(
        BlogPostBuilder.build()
          .withDescription(undefined as unknown as ILocalizedTextInput)
          .toProps(),
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(
        LocalizedText.ERROR_CODE,
      );
    });

    it('should return Left when content is undefined', () => {
      const result = BlogPost.create(
        BlogPostBuilder.build()
          .withContent(undefined as unknown as ILocalizedTextInput)
          .toProps(),
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(
        LocalizedText.ERROR_CODE,
      );
    });

    it('should return Left when description is missing the es locale', () => {
      const result = BlogPost.create(
        BlogPostBuilder.build()
          .withDescription({
            'en-US': 'A short description.',
            'pt-BR': 'Uma descrição curta.',
          })
          .toProps(),
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(BlogPost.ERROR_CODE);
    });

    it('should return Left when content is missing the pt-BR locale', () => {
      const result = BlogPost.create(
        BlogPostBuilder.build()
          .withContent({ 'en-US': 'Full post content.', es: 'Contenido.' })
          .toProps(),
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(BlogPost.ERROR_CODE);
    });

    it('should return Left when a tag is invalid', () => {
      const result = BlogPost.create(
        BlogPostBuilder.build().withTags(['Invalid Tag!']).toProps(),
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(Tag.ERROR_CODE);
    });

    it('should return Left for an invalid coverImage url', () => {
      const result = BlogPost.create(
        BlogPostBuilder.build()
          .withCoverImage({ url: 'not-a-url', alt: validAlt })
          .toProps(),
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(Image.ERROR_CODE_URL);
    });

    it('should return Left for an invalid thumbnailImage url', () => {
      const result = BlogPost.create(
        BlogPostBuilder.build()
          .withThumbnailImage({ url: 'not-a-url', alt: validAlt })
          .toProps(),
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(Image.ERROR_CODE_URL);
    });

    it('should return Left when author name is invalid', () => {
      const result = BlogPost.create(
        BlogPostBuilder.build()
          .withAuthor({
            name: '',
            avatarUrl: 'https://example.com/avatar.jpg',
          })
          .toProps(),
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(
        PersonName.ERROR_CODE,
      );
    });

    it('should return Left when author avatarUrl is invalid', () => {
      const result = BlogPost.create(
        BlogPostBuilder.build()
          .withAuthor({
            name: 'John Doe',
            avatarUrl: 'not-a-url',
          })
          .toProps(),
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(Url.ERROR_CODE);
    });

    it('should return Left when author url is invalid', () => {
      const result = BlogPost.create(
        BlogPostBuilder.build()
          .withAuthor({
            name: 'John Doe',
            avatarUrl: 'https://example.com/avatar.jpg',
            url: 'not-a-url',
          })
          .toProps(),
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(Url.ERROR_CODE);
    });
  });

  describe('status and featured', () => {
    it('should default status to DRAFT and featured to false when omitted', () => {
      const result = BlogPost.create(
        BlogPostBuilder.build()
          .withStatus(undefined as unknown as BlogPostStatus)
          .withFeatured(undefined as unknown as boolean)
          .toProps(),
      );

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.status).toBe(BlogPostStatus.DRAFT);
      expect(result.value.featured).toBe(false);
    });

    it('should expose the provided status and featured flag', () => {
      const result = BlogPost.create(
        BlogPostBuilder.build()
          .withStatus(BlogPostStatus.PUBLISHED)
          .withFeatured(true)
          .toProps(),
      );

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.status).toBe(BlogPostStatus.PUBLISHED);
      expect(result.value.featured).toBe(true);
    });

    it('should create a DRAFT post with no tags', () => {
      const result = BlogPost.create(
        BlogPostBuilder.build()
          .withStatus(BlogPostStatus.DRAFT)
          .withTags([])
          .toProps(),
      );

      expect(result.isRight()).toBe(true);
    });

    it('should create a post with no tags when status is omitted', () => {
      const { status: _status, ...propsWithoutStatus } = BlogPostBuilder.build()
        .withTags([])
        .toProps();

      const result = BlogPost.create(propsWithoutStatus);

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.status).toBe(BlogPostStatus.DRAFT);
    });

    it('should create a PUBLISHED post that has at least one tag', () => {
      const result = BlogPost.create(
        BlogPostBuilder.build()
          .withStatus(BlogPostStatus.PUBLISHED)
          .withTags(['nextjs'])
          .toProps(),
      );

      expect(result.isRight()).toBe(true);
    });

    it('should return Left when status is not a BlogPostStatus value', () => {
      const result = BlogPost.create(
        BlogPostBuilder.build()
          .withStatus('SCHEDULED' as BlogPostStatus)
          .toProps(),
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(BlogPost.ERROR_CODE);
    });

    it('should return Left when a PUBLISHED post has no tags', () => {
      const result = BlogPost.create(
        BlogPostBuilder.build()
          .withStatus(BlogPostStatus.PUBLISHED)
          .withTags([])
          .toProps(),
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(BlogPost.ERROR_CODE);
    });
  });

  describe('publish()', () => {
    it('should set status to PUBLISHED from DRAFT when the post has tags', () => {
      const post = BlogPostBuilder.build()
        .withStatus(BlogPostStatus.DRAFT)
        .withTags(['nextjs'])
        .now();

      const result = post.publish();

      expect(result.isRight()).toBe(true);
      expect(post.status).toBe(BlogPostStatus.PUBLISHED);
    });

    it('should set status to PUBLISHED from ARCHIVED when the post has tags', () => {
      const post = BlogPostBuilder.build()
        .withStatus(BlogPostStatus.ARCHIVED)
        .withTags(['nextjs'])
        .now();

      const result = post.publish();

      expect(result.isRight()).toBe(true);
      expect(post.status).toBe(BlogPostStatus.PUBLISHED);
    });

    it('should return Left when the post is already PUBLISHED', () => {
      const post = BlogPostBuilder.build()
        .withStatus(BlogPostStatus.PUBLISHED)
        .withTags(['nextjs'])
        .now();

      const result = post.publish();

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(BlogPost.ERROR_CODE);
    });

    it('should return Left when the post has no tags', () => {
      const post = BlogPostBuilder.build()
        .withStatus(BlogPostStatus.DRAFT)
        .withTags([])
        .now();

      const result = post.publish();

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(BlogPost.ERROR_CODE);
    });

    it('should not change status when publish() returns Left', () => {
      const post = BlogPostBuilder.build()
        .withStatus(BlogPostStatus.DRAFT)
        .withTags([])
        .now();

      post.publish();

      expect(post.status).toBe(BlogPostStatus.DRAFT);
    });
  });

  describe('archive()', () => {
    it('should set status to ARCHIVED from DRAFT', () => {
      const post = BlogPostBuilder.build()
        .withStatus(BlogPostStatus.DRAFT)
        .now();

      const result = post.archive();

      expect(result.isRight()).toBe(true);
      expect(post.status).toBe(BlogPostStatus.ARCHIVED);
    });

    it('should set status to ARCHIVED from PUBLISHED', () => {
      const post = BlogPostBuilder.build()
        .withStatus(BlogPostStatus.PUBLISHED)
        .withTags(['nextjs'])
        .now();

      const result = post.archive();

      expect(result.isRight()).toBe(true);
      expect(post.status).toBe(BlogPostStatus.ARCHIVED);
    });

    it('should return Left when the post is already ARCHIVED', () => {
      const post = BlogPostBuilder.build()
        .withStatus(BlogPostStatus.ARCHIVED)
        .now();

      const result = post.archive();

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(BlogPost.ERROR_CODE);
      expect(post.status).toBe(BlogPostStatus.ARCHIVED);
    });
  });

  describe('status lifecycle', () => {
    it('should move through DRAFT -> PUBLISHED -> ARCHIVED -> PUBLISHED', () => {
      const post = BlogPostBuilder.build()
        .withStatus(BlogPostStatus.DRAFT)
        .withTags(['nextjs'])
        .now();

      expect(post.publish().isRight()).toBe(true);
      expect(post.status).toBe(BlogPostStatus.PUBLISHED);

      expect(post.archive().isRight()).toBe(true);
      expect(post.status).toBe(BlogPostStatus.ARCHIVED);

      expect(post.publish().isRight()).toBe(true);
      expect(post.status).toBe(BlogPostStatus.PUBLISHED);
    });

    it('should reject a redundant transition without changing status', () => {
      const post = BlogPostBuilder.build()
        .withStatus(BlogPostStatus.DRAFT)
        .withTags(['nextjs'])
        .now();

      expect(post.publish().isRight()).toBe(true);
      expect(post.publish().isLeft()).toBe(true);
      expect(post.status).toBe(BlogPostStatus.PUBLISHED);
    });
  });

  describe('compareByPublication', () => {
    const post = (publishedAt: string): BlogPost =>
      BlogPostBuilder.build().withPublishedAt(publishedAt).now();

    it('should sort the earlier-published post before the later one', () => {
      const earlier = post('2026-01-01T00:00:00.000Z');
      const later = post('2026-06-01T00:00:00.000Z');

      expect(BlogPost.compareByPublication(earlier, later)).toBeLessThan(0);
      expect(BlogPost.compareByPublication(later, earlier)).toBeGreaterThan(0);
    });

    it('should treat posts published at the same instant as equal', () => {
      const a = post('2026-03-01T12:00:00.000Z');
      const b = post('2026-03-01T12:00:00.000Z');

      expect(BlogPost.compareByPublication(a, b)).toBe(0);
    });

    it('should order a list chronologically when used as an Array.sort comparator', () => {
      const posts = [
        post('2026-06-01T00:00:00.000Z'),
        post('2026-01-01T00:00:00.000Z'),
        post('2026-03-01T00:00:00.000Z'),
      ];

      const ordered = [...posts].sort(BlogPost.compareByPublication);

      expect(ordered.map((p) => p.publishedAt.value)).toEqual([
        '2026-01-01T00:00:00.000Z',
        '2026-03-01T00:00:00.000Z',
        '2026-06-01T00:00:00.000Z',
      ]);
    });
  });
});
