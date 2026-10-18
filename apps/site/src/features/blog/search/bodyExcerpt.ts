import { excerptAround, foldForSearch } from '@repo/utils/text';

/** A `[from, to)` range of characters to highlight. */
export type MarkRange = readonly [from: number, to: number];

export interface IBodyExcerpt {
  text: string;
  /** Sorted, non-overlapping ranges of `text` where a term appears. */
  marks: MarkRange[];
}

const escapeRegExp = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Every `[from, to)` where `term` occurs in `text`. */
const occurrences = (text: string, term: string): MarkRange[] =>
  Array.from(text.matchAll(new RegExp(escapeRegExp(term), 'g')), (match) => [
    match.index,
    match.index + term.length,
  ]);

/** Sorted ranges with overlapping or touching ones joined. */
const merge = (ranges: MarkRange[]): MarkRange[] =>
  [...ranges]
    .sort(([a], [b]) => a - b)
    .reduce<MarkRange[]>((merged, [from, to]) => {
      const last = merged.at(-1);
      if (last && from <= last[1]) {
        return [...merged.slice(0, -1), [last[0], Math.max(last[1], to)]];
      }
      return [...merged, [from, to]];
    }, []);

/**
 * The passage around the first body occurrence of any term, with every term
 * occurrence inside it marked; `null` when the body has none of the terms.
 * Matching runs on folded text, and folding keeps lengths, so the marks land
 * on the original characters.
 */
export function bodyExcerpt(
  body: string,
  terms: readonly string[],
): IBodyExcerpt | null {
  const original = body.normalize('NFC');
  const folded = foldForSearch(original);
  const first = terms
    .flatMap((term) => occurrences(folded, term).slice(0, 1))
    .sort(([a], [b]) => a - b)
    .at(0);
  if (!first) return null;

  const excerpt = excerptAround(original, first[0], first[1]);
  const foldedExcerpt = foldForSearch(excerpt.text);

  return {
    text: excerpt.text,
    marks: merge(terms.flatMap((term) => occurrences(foldedExcerpt, term))),
  };
}
