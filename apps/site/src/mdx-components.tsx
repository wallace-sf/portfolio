import type { MDXRemoteProps } from 'next-mdx-remote/rsc';

/**
 * MDX elements render as native HTML — the `.blog-prose` container in
 * `globals.css` styles them, and fenced code blocks are styled by
 * `rehype-pretty-code`. Add an entry here only for a genuinely custom element
 * (e.g. a `<Callout>`), not for restyling native tags.
 */
export const mdxComponents: NonNullable<MDXRemoteProps['components']> = {};
