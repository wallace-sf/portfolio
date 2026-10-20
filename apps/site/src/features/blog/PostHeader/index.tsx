import { Icon } from '@repo/ui/Imagery';
import { getTranslations } from 'next-intl/server';

import { PostMeta } from '~features/blog/PostMeta';
import { TagLink } from '~features/blog/TagLink';

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

/** The post's title block: metadata line, title, description and tags. */
export async function PostHeader({
  title,
  description,
  tags,
  ...meta
}: IPostHeaderProps) {
  const t = await getTranslations({ locale: meta.locale, namespace: 'Blog' });

  return (
    <header className="flex flex-col gap-4">
      <PostMeta {...meta} />

      <h1 className="text-heading-h2">{title}</h1>

      <p className="text-body-lg text-content-secondary">{description}</p>

      {tags.length > 0 && (
        <div className="flex items-center gap-2">
          <Icon
            icon="mdi:tag-multiple-outline"
            className="shrink-0 text-xl text-content-muted"
          />
          <ul aria-label={t('tags')} className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <li key={tag}>
                <TagLink tag={tag} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
