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
        <ul className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <li key={tag}>
              <TagLink tag={tag} />
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
