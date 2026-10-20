import { cache } from 'react';

import { transformerNotationDiff } from '@shikijs/transformers';
import type { Root } from 'hast';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { remarkMark } from 'remark-mark-highlight';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

import { rehypeHeadingAnchors } from './rehypeHeadingAnchors';
import { rehypeLazyImages } from './rehypeLazyImages';
import { rehypeMermaid } from './rehypeMermaid';
import { rehypeZoomableImages } from './rehypeZoomableImages';

const sanitizeSchema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames ?? []), 'mark'],
};

/**
 * Markdown (GFM + `==mark==`) → HAST. Raw HTML is never rendered (no
 * `rehype-raw`), and the author's input is sanitized *before* the trusted
 * transforms: heading ids (added after sanitization so they don't get the
 * sanitizer's `user-content-` clobber prefix, and match `markdownHeadings`)
 * and the h2/h3 self-links built from them, images get lazy-loading hints
 * and become zoomable client-island elements (unless linked), mermaid fences become a client-island element, and `rehype-pretty-code`
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
  .use(rehypeHeadingAnchors)
  .use(rehypeLazyImages)
  .use(rehypeZoomableImages)
  .use(rehypeMermaid)
  .use(rehypePrettyCode, {
    // Both palettes ship as CSS variables; globals.css picks one per theme.
    theme: { dark: 'github-dark', light: 'github-light' },
    keepBackground: true,
    transformers: [transformerNotationDiff()],
  });

/**
 * Cached per request in Server Components, so a page that renders `Markdown`
 * and reads `markdownHeadings` for the same content runs the pipeline once.
 * Consumers only read the tree.
 */
export const markdownToHast = cache(
  async (markdown: string): Promise<Root> =>
    processor.run(processor.parse(markdown)),
);
