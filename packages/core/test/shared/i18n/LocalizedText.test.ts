import { LocalizedText, ValidationError } from '../../../src';

describe('LocalizedText', () => {
  describe('get(locale, fallback?)', () => {
    it('returns requested locale when available', () => {
      const result = LocalizedText.create({
        'pt-BR': 'Olá',
        'en-US': 'Hello',
        es: 'Hola',
      });

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.get('pt-BR')).toBe('Olá');
      expect(result.value.get('en-US')).toBe('Hello');
      expect(result.value.get('es')).toBe('Hola');
    });

    it('falls back to provided fallback locale when main is missing', () => {
      const result = LocalizedText.create({ 'pt-BR': 'Olá', 'en-US': 'Hello' });

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.get('es', 'en-US')).toBe('Hello');
      expect(result.value.get('es', 'pt-BR')).toBe('Olá');
    });

    it('defaults to en-US when requested locale is missing and no fallback', () => {
      const result = LocalizedText.create({ 'pt-BR': 'Olá', 'en-US': 'Hello' });

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.get('es')).toBe('Hello');
    });

    it('defaults to en-US when both requested locale and fallback are missing', () => {
      const result = LocalizedText.create({ 'en-US': 'Only EN-US' });

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.get('pt-BR')).toBe('Only EN-US');
      expect(result.value.get('pt-BR', 'es')).toBe('Only EN-US');
    });
  });

  describe('normalization', () => {
    it('trims values', () => {
      const result = LocalizedText.create({
        'pt-BR': '  Olá  ',
        'en-US': '  Hello  ',
        es: '  Hola  ',
      });

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.value['pt-BR']).toBe('Olá');
      expect(result.value.value['en-US']).toBe('Hello');
      expect(result.value.value.es).toBe('Hola');
    });

    it('treats empty strings as missing', () => {
      const result = LocalizedText.create({
        'en-US': 'Hello',
        'pt-BR': '',
        es: '   ',
      });

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.get('pt-BR')).toBe('Hello');
      expect(result.value.get('es')).toBe('Hello');
    });
  });

  describe('validation', () => {
    it('should return Left when en-US is missing', () => {
      const result = LocalizedText.create({ 'en-US': undefined as unknown as string });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(ValidationError);
      expect((result.value as ValidationError).code).toBe(LocalizedText.ERROR_CODE);
      expect((result.value as ValidationError).message).toBe(
        'en-US is required and must be non-empty after trim.',
      );
    });

    it('should return Left for empty en-US string', () => {
      const result = LocalizedText.create({ 'en-US': '' });

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(LocalizedText.ERROR_CODE);
    });

    it('should return Left for whitespace-only en-US', () => {
      const result = LocalizedText.create({ 'en-US': '   ' });

      expect(result.isLeft()).toBe(true);
      expect((result.value as ValidationError).code).toBe(LocalizedText.ERROR_CODE);
    });
  });

  describe('immutability', () => {
    it('exposes frozen value', () => {
      const result = LocalizedText.create({ 'pt-BR': 'Olá', 'en-US': 'Hello' });

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(Object.isFrozen(result.value.value)).toBe(true);
      expect(() => {
        (result.value.value as { 'pt-BR': string })['pt-BR'] = 'x';
      }).toThrow();
    });
  });

  describe('equals (deep comparison)', () => {
    it('should be equal when two LocalizedText instances have the same content', () => {
      const r1 = LocalizedText.create({ 'pt-BR': 'Olá', 'en-US': 'Hello' });
      const r2 = LocalizedText.create({ 'pt-BR': 'Olá', 'en-US': 'Hello' });

      expect(r1.isRight() && r2.isRight()).toBe(true);
      if (!r1.isRight() || !r2.isRight()) return;
      expect(r1.value.equals(r2.value)).toBe(true);
    });

    it('should not be equal when two LocalizedText instances have different content', () => {
      const r1 = LocalizedText.create({ 'en-US': 'Hello', 'pt-BR': 'Olá' });
      const r2 = LocalizedText.create({ 'en-US': 'Goodbye', 'pt-BR': 'Tchau' });

      expect(r1.isRight() && r2.isRight()).toBe(true);
      if (!r1.isRight() || !r2.isRight()) return;
      expect(r1.value.equals(r2.value)).toBe(false);
    });
  });
});
