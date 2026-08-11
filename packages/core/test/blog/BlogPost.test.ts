import {
  BlogPost,
  DateTime,
  IBlogPostProps,
  LocalizedText,
  Slug,
  Tag,
  Url,
  ValidationError,
} from '~/index';

function validProps(overrides: Partial<IBlogPostProps> = {}): IBlogPostProps {
  return {
    slug: 'my-first-post',
    title: {
      'en-US': 'My First Post',
      'pt-BR': 'Meu Primeiro Post',
      es: 'Mi Primer Post',
    },
    description: {
      'en-US': 'A short description.',
      'pt-BR': 'Uma descrição curta.',
      es: 'Una descripción corta.',
    },
    content: {
      'en-US': 'Full post content.',
      'pt-BR': 'Conteúdo completo do post.',
      es: 'Contenido completo del post.',
    },
    tags: ['nextjs', 'architecture'],
    publishedAt: '2026-08-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('BlogPost', () => {
  describe('when created from valid props', () => {
    it('should return Right with a valid BlogPost', () => {
      const result = BlogPost.create(validProps());

      expect(result.isRight()).toBe(true);
      expect(result.value).toBeInstanceOf(BlogPost);
    });

    it('should create BlogPost with all fields as VOs', () => {
      const result = BlogPost.create(validProps());

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

    it('should create BlogPost without a coverImage', () => {
      const result = BlogPost.create(validProps());

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.coverImage).toBeUndefined();
    });

    it('should create BlogPost with a coverImage', () => {
      const result = BlogPost.create(
        validProps({ coverImage: 'https://example.com/cover.png' }),
      );

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.coverImage).toBeInstanceOf(Url);
    });

    it('should create BlogPost with an empty tags list', () => {
      const result = BlogPost.create(validProps({ tags: [] }));

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.tags).toHaveLength(0);
    });

    it('should default to an empty tags list when tags is undefined', () => {
      const result = BlogPost.create(
        validProps({ tags: undefined as unknown as string[] }),
      );

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.tags).toHaveLength(0);
    });
  });

  describe('when created from invalid props', () => {
    it('should return Left for an invalid slug', () => {
      const result = BlogPost.create(validProps({ slug: 'Not A Slug' }));

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(ValidationError);
    });

    it('should return Left for a missing publishedAt', () => {
      const result = BlogPost.create(
        validProps({ publishedAt: undefined as unknown as string }),
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(DateTime.ERROR_CODE);
    });

    it('should return Left for an invalid publishedAt', () => {
      const result = BlogPost.create(validProps({ publishedAt: 'not-a-date' }));

      expect(result.isLeft()).toBe(true);
    });

    it('should return Left when title is missing the pt-BR locale', () => {
      const result = BlogPost.create(
        validProps({
          title: { 'en-US': 'My First Post', es: 'Mi Primer Post' },
        }),
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(BlogPost.ERROR_CODE);
    });

    it('should return Left when title is undefined', () => {
      const result = BlogPost.create(
        validProps({ title: undefined as unknown as IBlogPostProps['title'] }),
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(
        LocalizedText.ERROR_CODE,
      );
    });

    it('should return Left when description is undefined', () => {
      const result = BlogPost.create(
        validProps({
          description: undefined as unknown as IBlogPostProps['description'],
        }),
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(
        LocalizedText.ERROR_CODE,
      );
    });

    it('should return Left when content is undefined', () => {
      const result = BlogPost.create(
        validProps({
          content: undefined as unknown as IBlogPostProps['content'],
        }),
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(
        LocalizedText.ERROR_CODE,
      );
    });

    it('should return Left when description is missing the es locale', () => {
      const result = BlogPost.create(
        validProps({
          description: {
            'en-US': 'A short description.',
            'pt-BR': 'Uma descrição curta.',
          },
        }),
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(BlogPost.ERROR_CODE);
    });

    it('should return Left when content is missing the pt-BR locale', () => {
      const result = BlogPost.create(
        validProps({
          content: { 'en-US': 'Full post content.', es: 'Contenido.' },
        }),
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(BlogPost.ERROR_CODE);
    });

    it('should return Left when a tag is invalid', () => {
      const result = BlogPost.create(validProps({ tags: ['Invalid Tag!'] }));

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(Tag.ERROR_CODE);
    });

    it('should return Left for an invalid coverImage url', () => {
      const result = BlogPost.create(
        validProps({ coverImage: 'not-a-url' }),
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(Url.ERROR_CODE);
    });
  });
});
