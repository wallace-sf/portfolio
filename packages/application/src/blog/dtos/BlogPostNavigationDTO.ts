/** A minimal reference to a post — enough to render a navigation link. */
export type BlogPostLinkDTO = {
  slug: string;
  title: string;
  /** ISO timestamp — the delivery layer builds the dated href from it. */
  publishedAt: string;
};

/** The posts adjacent to a given post in publication order. */
export type BlogPostNavigationDTO = {
  /** The chronologically newer post, if any. */
  newer?: BlogPostLinkDTO;
  /** The chronologically older post, if any. */
  older?: BlogPostLinkDTO;
};
