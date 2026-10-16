import { cache } from 'react';

import type { Root } from 'hast';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { remarkMark } from 'remark-mark-highlight';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

import { rehypeMermaid } from './rehypeMermaid';

const sanitizeSchema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames ?? []), 'mark'],
};

/**
 * Markdown (GFM + `==mark==`) → HAST. Raw HTML is never rendered (no
 * `rehype-raw`), and the author's input is sanitized *before* the trusted
 * transforms: heading ids (added after sanitization so they don't get the
 * sanitizer's `user-content-` clobber prefix, and match `markdownHeadings`),
 * mermaid fences become a client-island element, and `rehype-pretty-code`
 * emits inline `style` / `data-*` attributes that the sanitizer would
 * otherwise strip. The default schema keeps the
 * `language-*` class on `<code>` that both of them read.
 */
const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkMark)
  .use(remarkRehype)
  .use(rehypeSanitize, sanitizeSchema)
  .use(rehypeSlug)
  .use(rehypeMermaid)
  .use(rehypePrettyCode, { theme: 'github-dark', keepBackground: true });

/**
 * Cached per request in Server Components, so a page that renders `Markdown`
 * and reads `markdownHeadings` for the same content runs the pipeline once.
 * Consumers only read the tree.
 */
export const markdownToHast = cache(
  async (markdown: string): Promise<Root> =>
    processor.run(processor.parse(markdown)),
);
