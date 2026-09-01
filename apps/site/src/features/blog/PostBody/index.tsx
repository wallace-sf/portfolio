import classNames from 'classnames';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypePrettyCode from 'rehype-pretty-code';

import { mdxComponents } from '~/mdx-components';

const rehypePrettyCodePlugin: [
  typeof rehypePrettyCode,
  { theme: string; keepBackground: boolean },
] = [rehypePrettyCode, { theme: 'github-dark', keepBackground: true }];

const MDX_OPTIONS = {
  mdxOptions: {
    rehypePlugins: [rehypePrettyCodePlugin],
  },
};

/**
 * Typography for the rendered MDX. The MDX compiles to native elements, styled
 * here with arbitrary-variant selectors; fenced code blocks arrive fully
 * styled from `rehype-pretty-code` (`keepBackground` gives each its own dark
 * surface), so they only need spacing + horizontal scroll.
 */
const PROSE = classNames(
  'text-body-base leading-relaxed text-content-primary',
  '[&>*+*]:mt-5',
  '[&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:text-heading-h4',
  '[&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:text-heading-h5',
  '[&_a]:font-medium [&_a]:text-brand-primary [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:no-underline',
  '[&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1',
  '[&_blockquote]:border-l-2 [&_blockquote]:border-border-default [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-content-secondary',
  '[&_strong]:font-bold [&_strong]:text-content-primary',
  '[&_:not(pre)>code]:rounded [&_:not(pre)>code]:bg-surface-raised [&_:not(pre)>code]:px-1.5 [&_:not(pre)>code]:py-0.5 [&_:not(pre)>code]:text-[0.9em]',
  '[&_pre]:my-6 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:text-body-xs',
  '[&_figure[data-rehype-pretty-code-figure]]:my-6 [&_figure[data-rehype-pretty-code-figure]_pre]:my-0',
);

export interface IPostBodyProps {
  content: string;
}

export function PostBody({ content }: IPostBodyProps) {
  return (
    <div className={PROSE}>
      <MDXRemote
        source={content}
        components={mdxComponents}
        options={MDX_OPTIONS}
      />
    </div>
  );
}
