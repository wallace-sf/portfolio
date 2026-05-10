import { FC } from 'react';

import { Link } from '~i18n/routing';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface IBreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: FC<IBreadcrumbProps> = ({ items }) => (
  <nav aria-label="breadcrumb">
    <ol className="flex flex-row flex-wrap items-center gap-x-2 text-body-xs">
      {items.map((item, i) => (
        <li key={i} className="flex items-center gap-x-2">
          {i > 0 && <span className="!text-dark-700">/</span>}
          {item.href ? (
            <Link
              href={item.href}
              className="!text-dark-700 hover:!text-white transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="!text-white">{item.label}</span>
          )}
        </li>
      ))}
    </ol>
  </nav>
);
