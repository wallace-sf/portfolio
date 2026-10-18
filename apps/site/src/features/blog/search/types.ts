/**
 * What the client search needs from a post. Declared here, not taken from
 * `BlogPostSummaryDTO`: this code ships to the browser, and client code never
 * imports `@repo/application`, not even types. The listing page maps the
 * summaries to this shape.
 */
export type SearchablePost = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
};

/** Plain-text bodies from the search index, by slug. Empty until it loads. */
export type SearchBodies = Readonly<Record<string, string>>;
