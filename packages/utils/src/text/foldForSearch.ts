const COMBINING_MARKS = /\p{M}/gu;

/**
 * One character, folded as far as its length allows: lowercased with
 * diacritics removed, else only lowercased, else as is.
 */
const foldChar = (char: string): string => {
  const lower = char.toLowerCase();
  const stripped = lower.normalize('NFD').replace(COMBINING_MARKS, '');

  return [stripped, lower].find((c) => c.length === char.length) ?? char;
};

/**
 * Lowercased, diacritics removed, **same length as the input**: folded one
 * character at a time, so an index in the result points at the same
 * character in the original. That lets callers match on folded text and show
 * the original. Pass NFC text: a decomposed accent is its own code unit, so it
 * would survive as a stray mark and `validação` would no longer match.
 */
export function foldForSearch(value: string): string {
  return Array.from(value, foldChar).join('');
}
