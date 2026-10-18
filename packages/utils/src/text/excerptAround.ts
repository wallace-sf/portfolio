const ELLIPSIS = '…';

/** A cut right after these already reads as an ending: no `…` after it. */
const SENTENCE_END = /[.!?…]$/;

/** Words kept on each side of the match when no radius is given. */
export const EXCERPT_RADIUS_WORDS = 12;

export interface IExcerpt {
  text: string;
  /**
   * Subtract from an index in the original text to get its index in `text`
   * (the leading ellipsis is accounted for).
   */
  offset: number;
}

/**
 * About `radius` words either side of `[start, end)`, cut on word boundaries,
 * with an ellipsis on each side where the text was cut, except after a cut
 * that already ends a sentence (`errors.…` would read as a typo).
 */
export function excerptAround(
  text: string,
  start: number,
  end: number,
  radius: number = EXCERPT_RADIUS_WORDS,
): IExcerpt {
  const words = Array.from(text.matchAll(/\S+/g), (match) => ({
    from: match.index,
    to: match.index + match[0].length,
  }));
  if (words.length === 0) return { text: '', offset: 0 };

  const last = words.length - 1;
  const first = words.findIndex((word) => word.to > start);
  const firstHit = first === -1 ? last : first;
  // Words are in order, so those starting before `end` end at the last hit.
  const lastHit = Math.max(
    firstHit,
    words.filter((word) => word.from < end).length - 1,
  );

  const from = words[Math.max(0, firstHit - radius)]!.from;
  const to = words[Math.min(last, lastHit + radius)]!.to;
  const lead = from > 0 ? ELLIPSIS : '';
  const excerpt = text.slice(from, to);
  const tail = to < text.length && !SENTENCE_END.test(excerpt) ? ELLIPSIS : '';

  return {
    text: `${lead}${excerpt}${tail}`,
    offset: from - lead.length,
  };
}
