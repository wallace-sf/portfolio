import type { Root } from 'hast';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

/**
 * Markdown (GFM) → HAST for a post body. Raw HTML is never rendered (no
 * `rehype-raw`), and the author's input is sanitized *before* highlighting:
 * `rehype-pretty-code` emits inline `style` / `data-*` attributes that the
 * sanitizer would otherwise strip. The default schema keeps the
 * `language-*` class on `<code>` that the highlighter reads.
 */
const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeSanitize)
  .use(rehypePrettyCode, { theme: 'github-dark', keepBackground: true });

export async function markdownToHast(markdown: string): Promise<Root> {
  return processor.run(processor.parse(markdown));
}
