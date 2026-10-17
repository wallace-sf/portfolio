import { Badge } from '@repo/ui/View';

import { Link } from '~/i18n/routing';
import { blogTagPath } from '~features/blog/paths';

export interface ITagLinkProps {
  tag: string;
  /** Published posts with this tag; shown after the tag when given. */
  count?: number;
}

/** A tag as a badge that links to its tag page. */
export function TagLink({ tag, count }: ITagLinkProps) {
  return (
    <Link
      href={blogTagPath(tag)}
      className="group inline-flex rounded-badge focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
    >
      <Badge.Text
        label={count === undefined ? tag : `${tag} · ${count}`}
        className="transition-colors group-hover:bg-surface-selected"
      />
    </Link>
  );
}
