'use client';

import { FC, ReactNode } from 'react';

import classNames from 'classnames';
import Link from 'next/link';

export interface IRootProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export const Root: FC<IRootProps> = ({ href, children, className }) => {
  return (
    <Link href={href} className={classNames(className)}>
      {children}
    </Link>
  );
};
