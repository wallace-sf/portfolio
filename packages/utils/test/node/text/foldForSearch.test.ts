import { foldForSearch } from '../../../src/text';

describe('foldForSearch', () => {
  it('should lowercase and remove diacritics when given Portuguese and Spanish text', () => {
    expect(foldForSearch('Validação É ÑANDÚ')).toBe('validacao e nandu');
  });

  it('should leave plain ASCII lowercase text unchanged when nothing needs folding', () => {
    expect(foldForSearch('either-left_42')).toBe('either-left_42');
  });

  it('should keep the input length when a character folds to more than one code unit', () => {
    // `Ǆ` decomposes to `dž`, two letters: fold only as far as one unit allows.
    const input = 'ǄEMAL';

    expect(foldForSearch(input)).toBe('ǆemal');
    expect(foldForSearch(input)).toHaveLength(input.length);
  });

  it('should keep astral characters intact when the text has emoji', () => {
    expect(foldForSearch('Olá 🚀 Mundo')).toBe('ola 🚀 mundo');
  });

  it('should map every index 1:1 to the original when the text is NFC', () => {
    const original = 'Ação rápida: Ǆ, İ, 🚀 e São Paulo.';
    const folded = foldForSearch(original);

    expect(folded).toHaveLength(original.length);
    expect(
      original.slice(folded.indexOf('sao'), folded.indexOf('sao') + 3),
    ).toBe('São');
  });
});
