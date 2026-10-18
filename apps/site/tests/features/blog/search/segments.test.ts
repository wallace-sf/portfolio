import { describe, expect, it } from 'vitest';

import { toSegments } from '~features/blog/search/segments';

describe('toSegments', () => {
  it('should alternate plain and marked runs when the text has marks', () => {
    expect(
      toSegments('one Either two either', [
        [4, 10],
        [15, 21],
      ]),
    ).toEqual([
      { text: 'one ', marked: false },
      { text: 'Either', marked: true },
      { text: ' two ', marked: false },
      { text: 'either', marked: true },
    ]);
  });

  it('should drop empty runs when a mark touches an edge', () => {
    expect(toSegments('Either', [[0, 6]])).toEqual([
      { text: 'Either', marked: true },
    ]);
  });

  it('should return one plain run when there are no marks', () => {
    expect(toSegments('plain', [])).toEqual([{ text: 'plain', marked: false }]);
  });
});
