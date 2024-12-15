'use client';

import { FC } from 'react';

import Markdown from 'react-markdown';

import { REHYPE_PLUGINS, REMARK_PLUGINS } from './constants';

export interface ITextRichProps {
  content: string;
  className?: string;
}

export const TextRich: FC<ITextRichProps> = ({ content, className }) => {
  return (
    <Markdown
      className={className}
      rehypePlugins={REHYPE_PLUGINS}
      remarkPlugins={REMARK_PLUGINS}
    >
      {content}
    </Markdown>
  );
};
