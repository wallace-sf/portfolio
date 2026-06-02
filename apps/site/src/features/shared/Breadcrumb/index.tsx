'use client';

import { FC } from 'react';

import { Icon } from '@repo/ui/Imagery';
import classNames from 'classnames';

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
    <ol className="flex flex-row flex-wrap items-center gap-x-1">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;

        return (
          <li key={i} className="flex items-center gap-x-1">
            {i > 0 && (
              <Icon
                icon="material-symbols:arrow-forward-ios"
                className="!text-[20px] text-content-secondary [.light_&]:text-content-muted"
              />
            )}
            {isLast ? (
              <span className="px-3 py-1.5 rounded-lg text-sm text-content-primary bg-surface [.light_&]:bg-[#DADADA] [.light_&]:!text-content-secondary">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href ?? '#'}
                className="px-3 py-1.5 text-sm text-content-secondary hover:underline"
              >
                {item.label}
              </Link>
            )}
          </li>
        );
      })}
    </ol>
  </nav>
);
