import { groupBy } from '../../src/collections';

describe('groupBy', () => {
  it('should group items by key when several items share a key', () => {
    const words = ['apple', 'avocado', 'banana', 'blueberry', 'cherry'];

    expect(groupBy(words, (word) => word[0])).toEqual([
      ['a', ['apple', 'avocado']],
      ['b', ['banana', 'blueberry']],
      ['c', ['cherry']],
    ]);
  });

  it('should keep keys in first-seen order when numeric keys are not ascending', () => {
    const years = [2026, 2026, 2025, 2024];

    expect(groupBy(years, (year) => year).map(([key]) => key)).toEqual([
      2026, 2025, 2024,
    ]);
  });

  it('should keep the input order of items inside each group when keys interleave', () => {
    const items = [
      { id: 1, kind: 'x' },
      { id: 2, kind: 'y' },
      { id: 3, kind: 'x' },
    ];

    expect(groupBy(items, (item) => item.kind)).toEqual([
      ['x', [items[0], items[2]]],
      ['y', [items[1]]],
    ]);
  });

  it('should return an empty array when the input is empty', () => {
    expect(groupBy([], (item: string) => item)).toEqual([]);
  });

  it('should not mutate the input when grouping', () => {
    const input = ['b', 'a', 'b'];

    groupBy(input, (item) => item);

    expect(input).toEqual(['b', 'a', 'b']);
  });
});
