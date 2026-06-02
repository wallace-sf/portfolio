'use client';

import { FC, useState } from 'react';

import { Button } from '@repo/ui/Control';
import { Icon } from '@repo/ui/Imagery';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

import { TechnologiesModal } from '~features/about/TechnologiesModal';
import { SkillGroup } from '~features/shared/SkillGroup';
import { useBreakpoint } from '~hooks';
import { Link } from '~i18n/routing';

export interface IProjectCardProps {
  view: 'grid' | 'row';
  slug: string;
  title: string;
  caption: string;
  coverImage: { url: string; alt: string };
  theme?: string;
  skills: { name: string; icon: string }[];
  compact?: boolean;
}

export const ProjectCard: FC<IProjectCardProps> = ({
  view,
  slug,
  title,
  caption,
  coverImage,
  theme,
  compact: _compact = false,
  skills,
}) => {
  const t = useTranslations('ProjectCard');
  const isXL = useBreakpoint('xl');
  const [modalOpen, setModalOpen] = useState(false);

  if (view === 'row') {
    return (
      <article className="relative flex flex-row bg-surface rounded-xl w-full h-[339px] overflow-hidden">
        <div className="relative w-[380px] shrink-0">
          <Image
            src={coverImage.url}
            fill
            alt={coverImage.alt}
            className="object-cover"
            sizes="380px"
            priority
          />
        </div>

        <div className="flex flex-col flex-1 p-6 gap-5">
          <div className="flex flex-col gap-4 flex-1">
            {theme && (
              <span className="text-sm font-bold text-content-muted uppercase tracking-wide">
                {theme}
              </span>
            )}
            <h3 className="text-2xl font-bold text-content-primary">{title}</h3>
            <p className="text-base font-normal text-content-secondary line-clamp-3">
              {caption}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <SkillGroup
              skills={skills}
              max={3}
              initializeWithMax={3}
              total={skills.length}
              onShowAll={() => {
                // close?.();
                setModalOpen(true);
              }}
            />
            <Link
              href={`/projects/${slug}`}
              className="flex flex-row justify-center items-center gap-2 bg-brand-primary text-body-sm text-content-primary font-bold rounded-xl hover:bg-brand-primary-hover transition-colors duration-300 py-3 px-6"
            >
              {t('view_project')}
              <Icon icon="ic:round-arrow-forward" className="text-xl" />
            </Link>
          </div>
        </div>

        <Button.Clipboard
          unstyled
          text={`${typeof window !== 'undefined' ? window.location.origin : ''}/projects/${slug}`}
          tooltip={t('share_tooltip')}
          className="absolute top-3 right-3 z-10 flex items-center justify-center w-9 h-9 rounded-lg bg-surface-raised hover:bg-surface-interactive transition-colors"
        >
          {(copied) => (
            <Icon
              icon={copied ? 'ic:round-check' : 'ic:round-share'}
              className="text-xl text-content-secondary"
            />
          )}
        </Button.Clipboard>

        <TechnologiesModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          technologies={skills}
        />
      </article>
    );
  }

  return (
    <article className="relative bg-surface rounded-xl overflow-hidden">
      <div className="relative h-[244px] mx-3 mt-3 rounded-lg overflow-hidden">
        <Image
          src={coverImage.url}
          fill
          alt={coverImage.alt}
          className="object-cover"
          sizes="463px"
          priority
        />
        <Button.Clipboard
          unstyled
          text={`${typeof window !== 'undefined' ? window.location.origin : ''}/projects/${slug}`}
          tooltip={t('share_tooltip')}
          className="absolute top-2 right-2 z-10 flex items-center justify-center w-9 h-9 rounded-lg bg-surface-raised hover:bg-surface-interactive transition-colors"
        >
          {(copied) => (
            <Icon
              icon={copied ? 'ic:round-check' : 'ic:round-share'}
              className="text-xl text-content-secondary"
            />
          )}
        </Button.Clipboard>
      </div>

      <div className="flex flex-col p-4 gap-4">
        {theme && (
          <span className="text-xs font-bold text-content-muted uppercase tracking-wide">
            {theme}
          </span>
        )}
        <h3 className="text-2xl font-bold text-content-primary">{title}</h3>
        <p className="text-base font-normal text-content-secondary line-clamp-2">
          {caption}
        </p>
        <SkillGroup
          skills={skills}
          max={isXL ? 3 : 2}
          initializeWithMax={2}
          total={skills.length}
          onShowAll={() => {
            close?.();
            setModalOpen(true);
          }}
        />
        <Link
          href={`/projects/${slug}`}
          className="flex flex-row justify-center items-center gap-2 bg-brand-primary text-body-sm text-content-primary font-bold rounded-xl hover:bg-brand-primary-hover transition-colors duration-300 py-3 px-6"
        >
          {t('view_project')}
          <Icon icon="ic:round-arrow-forward" className="text-xl" />
        </Link>
      </div>

      <TechnologiesModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        technologies={skills}
      />
    </article>
  );
};
