import { Badge } from '@repo/ui/View';

import { formatPublishedAt } from '~features/blog/formatPublishedAt';

export interface IPostHeaderProps {
  title: string;
  description: string;
  publishedAt: string;
  tags: string[];
  locale: string;
}

export function PostHeader({
  title,
  description,
  publishedAt,
  tags,
  locale,
}: IPostHeaderProps) {
  return (
    <header className="flex flex-col gap-4">
      <time dateTime={publishedAt} className="text-body-xs text-content-muted">
        {formatPublishedAt(publishedAt, locale)}
      </time>

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
