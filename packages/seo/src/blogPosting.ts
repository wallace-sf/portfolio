/** A blog post as `buildBlogPostingJsonLd` needs it; URLs are absolute. */
export interface IBlogPostingInput {
  url: string;
  headline: string;
  description: string;
  /** ISO 8601. */
  datePublished: string;
  /** ISO 8601; defaults to `datePublished`. */
  dateModified?: string;
  author: { name: string; url?: string; image?: string };
  image?: string;
  keywords: string[];
  /** BCP 47, e.g. `pt-BR`. */
  inLanguage: string;
}

export interface IBlogPostingAuthor {
  '@type': 'Person';
  name: string;
  url?: string;
  image?: string;
}

/** A schema.org `BlogPosting` node, without `@context` (embed it in a graph or spread it). */
export interface IBlogPostingNode {
  '@type': 'BlogPosting';
  mainEntityOfPage: { '@type': 'WebPage'; '@id': string };
  url: string;
  headline: string;
  description: string;
  datePublished: string;
  dateModified: string;
  author: IBlogPostingAuthor;
  image?: string;
  keywords: string;
  inLanguage: string;
}

/** The `BlogPosting` JSON-LD node of a post. */
export function buildBlogPostingJsonLd({
  url,
  datePublished,
  dateModified = datePublished,
  author,
  keywords,
  ...rest
}: IBlogPostingInput): IBlogPostingNode {
  return {
    '@type': 'BlogPosting',
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    url,
    ...rest,
    datePublished,
    dateModified,
    author: { '@type': 'Person', ...author },
    keywords: keywords.join(', '),
  };
}
