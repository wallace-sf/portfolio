export const content = `Post bodies on this blog used to be MDX. They are now plain Markdown, run through a pipeline where
the order of the steps is the security model.

## Why not MDX

MDX compiles to JavaScript. That is the point of it, and it is also the problem: a post body
stored in a database becomes code the build runs. None of the posts used a component, a stray
\`<\` or \`{\` broke compilation, and a future admin app would have had to sandbox every edit. So
the body became GitHub-flavoured Markdown, which is data.

## The pipeline

\`\`\`ts {6}
const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkMark)
  .use(remarkRehype)
  .use(rehypeSanitize, sanitizeSchema)
  .use(rehypeSlug)
  .use(rehypeMermaid)
  .use(rehypePrettyCode, {
    theme: { dark: 'github-dark', light: 'github-light' },
    keepBackground: true,
    transformers: [transformerNotationDiff()],
  });
\`\`\`

There is no \`rehype-raw\`, so HTML written in a post is never parsed as HTML. Then the highlighted
line does the real work.

## Sanitize first, then trust

\`rehype-sanitize\` runs **right after** Markdown becomes HTML, while the tree still holds only what
the author wrote. It removes \`<script>\`, event handlers and \`javascript:\` URLs. The schema is
GitHub's default, plus \`<mark>\` for \`==highlights==\`.

Everything after it is code from this repository, not input, so it is allowed to add what the
sanitizer would strip:

- \`rehype-slug\` adds heading ids. Running it after the sanitizer keeps them as plain slugs,
  without the \`user-content-\` prefix the sanitizer adds to ids. The table of contents reads the
  same ids.
- \`rehypeMermaid\` turns \`mermaid\` fences into an element that a client island renders.
- \`rehype-pretty-code\` writes inline \`style\` and \`data-*\` attributes for both colour themes,
  the diff markers and highlighted lines like the one above.

Swap the order and you get one of two bugs: the sanitizer strips the highlighting, or the
highlighting runs over unsanitized input.

## Run it once per request

\`\`\`ts
export const markdownToHast = cache(
  async (markdown: string): Promise<Root> =>
    processor.run(processor.parse(markdown)),
);
\`\`\`

The post page renders the body and builds the table of contents from the same content. React's
\`cache()\` makes both read one tree instead of running the pipeline twice.
`;
