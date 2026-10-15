import { Fragment, type ReactNode } from 'react';

import { MermaidBlock } from '@repo/ui/View/MermaidBlock';
import classNames from 'classnames';
import { type Components, toJsxRuntime } from 'hast-util-to-jsx-runtime';
import { jsx, jsxs } from 'react/jsx-runtime';

import { markdownToHast } from './pipeline';
import { MERMAID_TAG } from './rehypeMermaid';

const COMPONENTS = { [MERMAID_TAG]: MermaidBlock } as Partial<Components>;

export interface IMarkdownProps {
  content: string;
  /** Extra classes for the `.markdown-body` container (e.g. text colour). */
  className?: string;
}

/**
 * Renders Markdown on the server inside the `.markdown-body` container, the
 * site's single Markdown typography (GitHub's stylesheet + design-token
 * overrides in `globals.css`). Mermaid diagrams are the one client island,
 * imported through their own `'use client'` entry so the boundary survives
 * bundling.
 */
export async function Markdown({
  content,
  className,
}: IMarkdownProps): Promise<ReactNode> {
  const body = toJsxRuntime(await markdownToHast(content), {
    Fragment,
    jsx,
    jsxs,
    components: COMPONENTS,
  });

  return <div className={classNames('markdown-body', className)}>{body}</div>;
}
