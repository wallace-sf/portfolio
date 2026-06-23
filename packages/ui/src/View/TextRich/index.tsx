'use client';

import { FC } from 'react';

import classNames from 'classnames';
import Markdown from 'react-markdown';
import type { Components } from 'react-markdown';

import { MermaidBlock } from './components/MermaidBlock';
import { REHYPE_PLUGINS, REMARK_PLUGINS } from './constants';

const MARKDOWN_COMPONENTS: Components = {
  code({ className, children }) {
    const language = /language-(\w+)/.exec(className ?? '')?.[1];

    if (language === 'mermaid' && typeof children === 'string') {
      return <MermaidBlock chart={children} />;
    }

    return <code className={className}>{children}</code>;
  },
};

export interface ITextRichProps {
  content: string;
  className?: string;
}

export const TextRich: FC<ITextRichProps> = ({ content, className }) => {
  return (
    <div className={classNames('markdown-body', className)}>
      <Markdown
        rehypePlugins={REHYPE_PLUGINS}
        remarkPlugins={REMARK_PLUGINS}
        components={MARKDOWN_COMPONENTS}
      >
        {content}
      </Markdown>
    </div>
  );
};
