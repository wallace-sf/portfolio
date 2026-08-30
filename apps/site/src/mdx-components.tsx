import type { MDXRemoteProps } from 'next-mdx-remote/rsc';

/**
 * No blog UI design decision exists yet — this intentionally maps MDX
 * elements to plain HTML with no custom styling/components. Revisit once a
 * design pass happens (tasks 7–8 of the blog single-app migration).
 */
export const mdxComponents: NonNullable<MDXRemoteProps['components']> = {};
