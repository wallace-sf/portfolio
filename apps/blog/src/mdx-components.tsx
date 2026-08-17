import type { MDXRemoteProps } from 'next-mdx-remote/rsc';

/**
 * No blog UI design decision exists yet — this intentionally maps MDX
 * elements to plain HTML with no custom styling/components. Revisit once a
 * design pass happens.
 */
export const mdxComponents: NonNullable<MDXRemoteProps['components']> = {};
