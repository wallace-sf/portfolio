const WORDS_PER_MINUTE = 200;

/** A word has at least one letter or digit, so bare syntax markers don't count. */
const WORD = /[\p{L}\p{N}]/u;

const countWords = (markdown: string): number =>
  markdown.split(/\s+/).filter((token) => WORD.test(token)).length;

/** Whole minutes to read `markdown` at 200 wpm; at least 1. */
export function readingMinutes(markdown: string): number {
  return Math.max(1, Math.ceil(countWords(markdown) / WORDS_PER_MINUTE));
}
