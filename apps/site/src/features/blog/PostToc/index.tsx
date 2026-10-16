import type { MarkdownHeading } from '@repo/ui/View';
import { getTranslations } from 'next-intl/server';

import { TableOfContents } from '~features/blog/TableOfContents';

/** Below this many h2/h3 headings a table of contents is noise. */
export const MIN_TOC_HEADINGS = 3;

export interface IPostTocProps {
  headings: MarkdownHeading[];
  locale: string;
  /** `inline`: a collapsed block above the body; `rail`: the sticky side column. */
  variant: 'inline' | 'rail';
}

/** The post's "On this page" table of contents, when it has enough headings. */
export async function PostToc({ headings, locale, variant }: IPostTocProps) {
  if (headings.length < MIN_TOC_HEADINGS) return null;

  const t = await getTranslations({ locale, namespace: 'Blog' });
  const label = t('tableOfContents');
  const toc = <TableOfContents headings={headings} label={label} />;

  if (variant === 'rail') return toc;

  return (
    <details className="rounded-card bg-surface px-5 py-3 shadow-drop-sm">
      <summary className="cursor-pointer text-body-sm font-medium text-content-primary">
        {label}
      </summary>
      <div className="pt-2">{toc}</div>
    </details>
  );
}
