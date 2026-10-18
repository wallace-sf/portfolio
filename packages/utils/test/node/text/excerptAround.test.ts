import { excerptAround } from '../../../src/text';

const words = (from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, i) => `w${from + i}`).join(' ');

describe('excerptAround', () => {
  it('should cut on word boundaries with ellipses on both sides when the match is mid-text', () => {
    const text = words(1, 40);
    const start = text.indexOf('w20');

    const { text: excerpt } = excerptAround(text, start, start + 3, 2);

    expect(excerpt).toBe('…w18 w19 w20 w21 w22…');
  });

  it('should not add a leading ellipsis when the match is at the start', () => {
    const text = words(1, 40);

    const { text: excerpt, offset } = excerptAround(text, 0, 2, 2);

    expect(excerpt).toBe('w1 w2 w3…');
    expect(offset).toBe(0);
  });

  it('should not add a trailing ellipsis when the match is at the end', () => {
    const text = words(1, 5);
    const start = text.indexOf('w5');

    expect(excerptAround(text, start, start + 2, 2).text).toBe('…w3 w4 w5');
  });

  it('should not add a trailing ellipsis when the cut lands right after a sentence end', () => {
    const text = 'Return a left. Then stop here and keep going for a while.';

    expect(excerptAround(text, 9, 13, 0).text).toBe('…left.');
  });

  it('should keep the trailing ellipsis when the cut lands after a comma', () => {
    const text = 'Return a left, then stop here and keep going.';

    expect(excerptAround(text, 9, 13, 0).text).toBe('…left,…');
  });

  it('should return the whole text without ellipses when it fits in the radius', () => {
    expect(excerptAround('short text here', 6, 10).text).toBe(
      'short text here',
    );
  });

  it('should include every word the match spans when the match covers several words', () => {
    const text = words(1, 40);
    const start = text.indexOf('w10');
    const end = text.indexOf('w12') + 3;

    expect(excerptAround(text, start, end, 1).text).toBe(
      '…w9 w10 w11 w12 w13…',
    );
  });

  it('should report an offset that maps original indices into the excerpt', () => {
    const text = words(1, 40);
    const start = text.indexOf('w20');

    const { text: excerpt, offset } = excerptAround(text, start, start + 3, 2);

    expect(excerpt.slice(start - offset, start - offset + 3)).toBe('w20');
  });

  it('should default to about a dozen words on each side when no radius is given', () => {
    const text = words(1, 100);
    const start = text.indexOf('w50');

    const { text: excerpt } = excerptAround(text, start, start + 3);

    expect(excerpt).toBe(`…${words(38, 62)}…`);
  });

  it('should return an empty excerpt when the text is empty', () => {
    expect(excerptAround('', 0, 0)).toEqual({ text: '', offset: 0 });
  });
});
