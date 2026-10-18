/**
 * One post in the client-side search index. Only what the listing doesn't
 * already carry: title, description and tags reach the page through the
 * summaries, and the search joins them by `slug`.
 */
export type BlogSearchEntryDTO = {
  slug: string;
  /** The body as plain text in the requested locale, fenced code removed. */
  text: string;
};
