import { LocalizedText, ValidationError } from '../../src';

describe('LocalizedText', () => {
  describe('get(locale, fallback?)', () => {
    it('returns requested locale when available', () => {
      const lt = LocalizedText.new({
        'pt-BR': 'Olá',
        'en-US': 'Hello',
        es: 'Hola',
      });

      expect(lt.get('pt-BR')).toBe('Olá');
      expect(lt.get('en-US')).toBe('Hello');
      expect(lt.get('es')).toBe('Hola');
    });

    it('falls back to provided fallback locale when main is missing', () => {
      const lt = LocalizedText.new({ 'pt-BR': 'Olá', 'en-US': 'Hello' });

      expect(lt.get('es', 'en-US')).toBe('Hello');
      expect(lt.get('es', 'pt-BR')).toBe('Olá');
    });

    it('defaults to pt-BR when requested locale is missing and no fallback', () => {
      const lt = LocalizedText.new({ 'pt-BR': 'Olá', 'en-US': 'Hello' });

      expect(lt.get('es')).toBe('Olá');
    });

    it('defaults to pt-BR when requested locale and fallback are both missing', () => {
      const lt = LocalizedText.new({ 'pt-BR': 'Só PT-BR' });

      expect(lt.get('en-US')).toBe('Só PT-BR');
      expect(lt.get('en-US', 'es')).toBe('Só PT-BR');
    });
  });

  describe('normalization', () => {
    it('trims values', () => {
      const lt = LocalizedText.new({
        'pt-BR': '  Olá  ',
        'en-US': '  Hello  ',
        es: '  Hola  ',
      });

      expect(lt.value['pt-BR']).toBe('Olá');
      expect(lt.value['en-US']).toBe('Hello');
      expect(lt.value.es).toBe('Hola');
      expect(lt.get('pt-BR')).toBe('Olá');
      expect(lt.get('en-US')).toBe('Hello');
      expect(lt.get('es')).toBe('Hola');
    });

    it('treats empty strings as missing', () => {
      const lt = LocalizedText.new({
        'pt-BR': 'Olá',
        'en-US': '',
        es: '   ',
      });

      expect(lt.get('en-US')).toBe('Olá');
      expect(lt.get('es')).toBe('Olá');
      expect(lt.get('en-US', 'es')).toBe('Olá');
    });
  });

  describe('validation', () => {
    const expectedMessage =
      'pt-BR is required and must be non-empty after trim.';

    it('rejects missing pt-BR', () => {
      expect(() =>
        LocalizedText.new({ 'pt-BR': undefined as unknown as string }),
      ).toThrow(new ValidationError({ code: LocalizedText.ERROR_CODE, message: expectedMessage }));

      expect(() => LocalizedText.new({ 'pt-BR': '' })).toThrow(
        new ValidationError({ code: LocalizedText.ERROR_CODE, message: expectedMessage }),
      );
    });

    it('rejects empty pt-BR after trim', () => {
      expect(() => LocalizedText.new({ 'pt-BR': '   ' })).toThrow(
        new ValidationError({ code: LocalizedText.ERROR_CODE, message: expectedMessage }),
      );
    });
  });

  describe('immutability', () => {
    it('exposes frozen value', () => {
      const lt = LocalizedText.new({ 'pt-BR': 'Olá', 'en-US': 'Hello' });

      expect(Object.isFrozen(lt.value)).toBe(true);
      expect(() => {
        (lt.value as { 'pt-BR': string })['pt-BR'] = 'x';
      }).toThrow();
    });
  });
});
