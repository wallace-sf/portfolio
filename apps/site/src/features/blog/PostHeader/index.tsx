import { Badge } from '@repo/ui/View';

import { PostMeta } from '~features/blog/PostMeta';

export interface IPostHeaderProps {
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  readingMinutes: number;
  authorName: string;
  tags: string[];
  locale: string;
}

/** Async only so the async `PostMeta` resolves wherever the header renders. */
export async function PostHeader({
  title,
  description,
  tags,
  ...meta
}: IPostHeaderProps) {
  return (
    <header className="flex flex-col gap-4">
      <PostMeta {...meta} />

      <h1 className="text-heading-h2">{title}</h1>

      <p className="text-body-lg text-content-secondary">{description}</p>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge.Text key={tag} label={tag} />
          ))}
        </div>
      )}
    </header>
  );
}
