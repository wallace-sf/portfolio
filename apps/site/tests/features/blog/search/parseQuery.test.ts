import { describe, expect, it } from 'vitest';

import { parseQuery } from '~features/blog/search/parseQuery';

describe('parseQuery', () => {
  it('should fold and split into terms when the query has several words', () => {
    expect(parseQuery('  Validação   EITHER ')).toEqual([
      'validacao',
      'either',
    ]);
  });

  it('should drop terms under 2 characters when the query has single letters', () => {
    expect(parseQuery('a vo b dto')).toEqual(['vo', 'dto']);
  });

  it('should return no terms when the query is blank', () => {
    expect(parseQuery('   ')).toEqual([]);
  });

  it('should fold decomposed accents when the input is NFD', () => {
    expect(parseQuery('validação')).toEqual(['validacao']);
  });
});
