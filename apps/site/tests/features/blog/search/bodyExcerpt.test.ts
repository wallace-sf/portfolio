import { describe, expect, it } from 'vitest';

import { bodyExcerpt } from '~features/blog/search/bodyExcerpt';

const marked = (excerpt: ReturnType<typeof bodyExcerpt>) =>
  excerpt?.marks.map(([from, to]) => excerpt.text.slice(from, to));

describe('bodyExcerpt', () => {
  it('should mark the original text when the match is accent-insensitive', () => {
    const excerpt = bodyExcerpt('A validação acontece no domínio.', [
      'validacao',
    ]);

    expect(excerpt?.text).toBe('A validação acontece no domínio.');
    expect(marked(excerpt)).toEqual(['validação']);
  });

  it('should mark every occurrence of every term when they fall inside the excerpt', () => {
    const excerpt = bodyExcerpt('Either left, either right: Either wins.', [
      'either',
      'right',
    ]);

    expect(marked(excerpt)).toEqual(['Either', 'either', 'right', 'Either']);
  });

  it('should center on the first occurrence of any term when the body is long', () => {
    const filler = Array.from({ length: 40 }, (_, i) => `w${i}`).join(' ');
    const excerpt = bodyExcerpt(`${filler} the Validator chain ${filler}`, [
      'validator',
    ]);

    expect(excerpt?.text.startsWith('…')).toBe(true);
    expect(excerpt?.text.endsWith('…')).toBe(true);
    expect(marked(excerpt)).toEqual(['Validator']);
  });

  it('should merge overlapping marks when terms overlap', () => {
    const excerpt = bodyExcerpt('A repository here.', ['repo', 'pository']);

    expect(marked(excerpt)).toEqual(['repository']);
  });

  it('should match literally when a term has regular-expression characters', () => {
    const excerpt = bodyExcerpt('Call Validator.of() first, not ofX.', [
      '.of()',
    ]);

    expect(marked(excerpt)).toEqual(['.of()']);
  });

  it('should return null when the body has none of the terms', () => {
    expect(bodyExcerpt('Nothing to see.', ['either'])).toBeNull();
  });

  it('should return null when there are no terms', () => {
    expect(bodyExcerpt('Anything.', [])).toBeNull();
  });
});
