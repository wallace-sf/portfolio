import { Fragment, type ReactNode } from 'react';

import { MermaidBlock } from '@repo/ui/View/MermaidBlock';
import { type Components, toJsxRuntime } from 'hast-util-to-jsx-runtime';
import { jsx, jsxs } from 'react/jsx-runtime';

import { markdownToHast } from './pipeline';
import { MERMAID_TAG } from './rehypeMermaid';

const COMPONENTS = { [MERMAID_TAG]: MermaidBlock } as Partial<Components>;

export interface IMarkdownProps {
  content: string;
}

/**
 * Renders Markdown on the server. It emits the content only, with no wrapper:
 * the caller owns the typography container. Mermaid diagrams are the one
 * client island, imported through their own `'use client'` entry so the
 * boundary survives bundling.
 */
export async function Markdown({
  content,
}: IMarkdownProps): Promise<ReactNode> {
  return toJsxRuntime(await markdownToHast(content), {
    Fragment,
    jsx,
    jsxs,
    components: COMPONENTS,
  });
}
