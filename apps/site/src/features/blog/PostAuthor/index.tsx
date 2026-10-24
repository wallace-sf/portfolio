import type { BlogPostAuthorDTO } from '@repo/application/blog';
import Image from 'next/image';

export interface IPostAuthorProps {
  author: Pick<BlogPostAuthorDTO, 'name' | 'avatarUrl' | 'url'>;
}

/** The author chip in the post header: round avatar + name (linked if `url`). */
export function PostAuthor({ author }: IPostAuthorProps) {
  const { name, avatarUrl, url } = author;

  return (
    <p className="text-body-sm flex items-center gap-3 font-medium text-content-primary">
      <Image
        src={avatarUrl}
        alt=""
        width={32}
        height={32}
        className="size-8 shrink-0 rounded-full"
      />
      {url ? (
        <a href={url} rel="author noopener" className="hover:underline">
          {name}
        </a>
      ) : (
        name
      )}
    </p>
  );
}
