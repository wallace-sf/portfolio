import { Image, ValidationError } from '~/index';

const validUrl = 'https://example.com/image.png';
const validAlt = {
  'en-US': 'Project cover image',
  'pt-BR': 'Imagem de capa do projeto',
};

describe('Image', () => {
  describe('when created from valid value', () => {
    it('should return Right with a valid URL and alt text', () => {
      const result = Image.create(validUrl, validAlt);

      expect(result.isRight()).toBe(true);
    });

    it('should expose url getter returning Url instance', () => {
      const result = Image.create(validUrl, validAlt);

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.url.value).toBe(validUrl);
    });

    it('should expose alt getter returning LocalizedText instance', () => {
      const result = Image.create(validUrl, validAlt);

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.alt.value['pt-BR']).toBe(validAlt['pt-BR']);
    });

    it('should accept alt text with multiple locales', () => {
      const result = Image.create(validUrl, {
        'pt-BR': 'Imagem',
        'en-US': 'Image',
        es: 'Imagen',
      });

      expect(result.isRight()).toBe(true);
    });
  });

  describe('when created from invalid value', () => {
    it('should return Left with INVALID_URL code when URL is invalid', () => {
      const result = Image.create('not-a-url', validAlt);

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(ValidationError);
      expect((result.value as ValidationError).code).toBe(Image.ERROR_CODE_URL);
    });

    it('should return Left when URL is empty', () => {
      const result = Image.create('', validAlt);

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(Image.ERROR_CODE_URL);
    });

    it('should return Left with INVALID_LOCALIZED_TEXT when en-US alt is missing', () => {
      const result = Image.create(validUrl, { 'en-US': '' });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(ValidationError);
      expect((result.value as ValidationError).code).toBe(Image.ERROR_CODE_ALT);
    });
  });

  describe('when compared', () => {
    it('should be equal when URL and alt are identical', () => {
      const r1 = Image.create(validUrl, validAlt);
      const r2 = Image.create(validUrl, validAlt);

      expect(r1.isRight() && r2.isRight()).toBe(true);
      if (!r1.isRight() || !r2.isRight()) return;
      expect(r1.value.equals(r2.value)).toBe(true);
    });

    it('should not be equal when URLs differ', () => {
      const r1 = Image.create(validUrl, validAlt);
      const r2 = Image.create('https://other.com/img.png', validAlt);

      expect(r1.isRight() && r2.isRight()).toBe(true);
      if (!r1.isRight() || !r2.isRight()) return;
      expect(r1.value.equals(r2.value)).toBe(false);
    });
  });
});
