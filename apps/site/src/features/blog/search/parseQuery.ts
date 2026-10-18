import { foldForSearch } from '@repo/utils/text';

/** Shorter terms match nearly every post, so they're ignored. */
export const MIN_TERM_LENGTH = 2;

/** The folded search terms in `raw`; empty when there is nothing to search. */
export function parseQuery(raw: string): string[] {
  return foldForSearch(raw.normalize('NFC'))
    .split(/\s+/)
    .filter((term) => term.length >= MIN_TERM_LENGTH);
}
