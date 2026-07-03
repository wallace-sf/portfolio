import { FC } from 'react';

import { Icon } from '@repo/ui/Imagery';

interface IWebsiteBadgeProps {
  projectUrl: string;
  label: string;
}

export const WebsiteBadge: FC<IWebsiteBadgeProps> = ({ projectUrl, label }) => (
  <a
    href={projectUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-x-1.5 rounded-full bg-brand-primary/10 px-3 py-1 text-sm text-brand-primary transition-colors hover:bg-brand-primary/20"
  >
    <Icon icon="material-symbols:open-in-new" className="text-base" />
    {label}
  </a>
);
