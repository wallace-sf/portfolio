import type { Schema } from 'hast-util-sanitize';
import type { PluggableList } from 'unified';

import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import { remarkMark } from 'remark-mark-highlight';

const sanitizeSchema: Schema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames ?? []), 'mark'],
};

export const REMARK_PLUGINS: PluggableList = [remarkGfm, remarkMark];
export const REHYPE_PLUGINS: PluggableList = [
  rehypeRaw,
  [rehypeSanitize, sanitizeSchema],
];
