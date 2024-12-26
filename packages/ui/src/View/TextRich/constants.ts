import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';

export const REMARK_PLUGINS = [remarkGfm];
export const REHYPE_PLUGINS = [rehypeRaw, rehypeSanitize];
