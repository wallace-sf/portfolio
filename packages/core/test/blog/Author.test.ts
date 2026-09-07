import { Author, LocalizedText, Url, ValidationError } from '~/index';

const validProps = {
  name: 'Wallace Ferreira',
  avatarUrl: 'https://github.com/wallace-sf.png',
};

const expectLeft = (
  result: ReturnType<typeof Author.create>,
  code: string = Author.ERROR_CODE,
): void => {
  expect(result.isLeft()).toBe(true);
  expect(result.value).toBeInstanceOf(ValidationError);
  expect((result.value as ValidationError).code).toBe(code);
};

describe('Author', () => {
  describe('when created from valid props', () => {
    it('should return Right when only name and avatarUrl are provided', () => {
      const result = Author.create({ ...validProps });

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.name).toBe('Wallace Ferreira');
      expect(result.value.avatarUrl).toBeInstanceOf(Url);
      expect(result.value.url).toBeUndefined();
      expect(result.value.bio).toBeUndefined();
    });

    it('should trim the name when creating an author', () => {
      const result = Author.create({
        ...validProps,
        name: '  Wallace Ferreira  ',
      });

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.name).toBe('Wallace Ferreira');
    });

    it('should return Right when url and bio are provided and valid', () => {
      const result = Author.create({
        ...validProps,
        url: 'https://wallace.dev',
        bio: { 'en-US': 'Senior engineer', 'pt-BR': 'Engenheiro sênior' },
      });

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.url).toBeInstanceOf(Url);
      expect(result.value.bio).toBeInstanceOf(LocalizedText);
    });

    it('should not require bio to have all locales', () => {
      const result = Author.create({
        ...validProps,
        bio: { 'en-US': 'Just english' },
      });

      expect(result.isRight()).toBe(true);
    });
  });

  describe('when created from invalid props', () => {
    it('should return Left when name is empty', () => {
      expectLeft(Author.create({ ...validProps, name: '' }));
    });

    it('should return Left when name is whitespace only', () => {
      expectLeft(Author.create({ ...validProps, name: '   ' }));
    });

    it('should return Left when name is shorter than 2 characters', () => {
      expectLeft(Author.create({ ...validProps, name: 'a' }));
    });

    it('should return Left when name is longer than 100 characters', () => {
      expectLeft(Author.create({ ...validProps, name: 'a'.repeat(101) }));
    });

    it('should return Left when avatarUrl is not a valid URL', () => {
      expectLeft(
        Author.create({ ...validProps, avatarUrl: 'not-a-url' }),
        Url.ERROR_CODE,
      );
    });

    it('should return Left when url is present but invalid', () => {
      expectLeft(
        Author.create({ ...validProps, url: 'not-a-url' }),
        Url.ERROR_CODE,
      );
    });

    it('should return Left when bio is present but not a valid LocalizedText', () => {
      expectLeft(
        Author.create({ ...validProps, bio: { 'en-US': '' } }),
        LocalizedText.ERROR_CODE,
      );
    });

    it('should return a single Left when multiple fields are invalid', () => {
      const result = Author.create({
        name: '',
        avatarUrl: 'not-a-url',
        url: 'not-a-url',
      });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(ValidationError);
      expect((result.value as ValidationError).code).toBe(Author.ERROR_CODE);
    });
  });

  describe('equality', () => {
    it('should treat two authors with the same props as equal', () => {
      const a = Author.create({ ...validProps, url: 'https://wallace.dev' });
      const b = Author.create({ ...validProps, url: 'https://wallace.dev' });

      expect(a.isRight()).toBe(true);
      expect(b.isRight()).toBe(true);
      if (!a.isRight() || !b.isRight()) return;
      expect(a.value.equals(b.value)).toBe(true);
    });

    it('should treat two authors with different props as not equal', () => {
      const a = Author.create({ ...validProps });
      const b = Author.create({ ...validProps, name: 'Someone Else' });

      expect(a.isRight()).toBe(true);
      expect(b.isRight()).toBe(true);
      if (!a.isRight() || !b.isRight()) return;
      expect(a.value.equals(b.value)).toBe(false);
    });
  });
});
