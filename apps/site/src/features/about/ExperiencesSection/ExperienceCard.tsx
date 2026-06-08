'use client';

import { FC } from 'react';

import { TextRich } from '@repo/ui/View';
import classNames from 'classnames';
import { useLocale, useTranslations } from 'next-intl';
import { useBoolean } from 'usehooks-ts';

import { SkillGroup } from '~features/shared/SkillGroup';
import { useBreakpoint } from '~hooks';

import { TechnologiesModal } from '../TechnologiesModal';

export interface IExperienceCardSkill {
  name: string;
  icon: string;
  description?: string;
}

export interface IExperienceCardProps {
  id: string;
  company: string;
  position: string;
  location: string;
  description?: string;
  logo?: { url: string; alt: string };
  employmentType: string;
  locationType: string;
  startAt: string;
  endAt?: string;
  skills: IExperienceCardSkill[];
}

export function calculateDuration(
  startAt: string,
  endAt?: string | null,
): string {
  const start = new Date(startAt);
  const end = endAt ? new Date(endAt) : new Date();
  const totalMonths =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  const parts: string[] = [];
  if (years > 0) parts.push(`${years}a`);
  if (months > 0) parts.push(`${months}m`);
  return parts.join(' ') || '1m';
}

function formatDate(dateStr: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateStr));
}

export const ExperienceCard: FC<IExperienceCardProps> = ({
  company,
  position,
  location,
  description,
  employmentType,
  locationType,
  skills,
  startAt,
  endAt,
}) => {
  const t = useTranslations('ExperienceCard');
  const locale = useLocale();
  const {
    value: modalOpen,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBoolean(false);
  const { value: expanded, toggle: toggleDescription } = useBoolean(false);
  const isXL = useBreakpoint('xl');

  const period = `${formatDate(startAt, locale)} - ${endAt ? formatDate(endAt, locale) : t('present')}`;
  const duration = calculateDuration(startAt, endAt);
  const locationLine = [location, employmentType, locationType]
    .filter(Boolean)
    .join(' • ');

  return (
    <>
      <article className="flex flex-col gap-y-2 py-6">
        <h2 className="text-2xl font-bold text-content-primary">{position}</h2>

        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="text-xl font-bold uppercase text-content-primary">
            {company}
          </span>
          <span className="text-base text-content-disabled">
            {period} ({duration})
          </span>
        </div>

        <span className="text-base text-content-disabled">{locationLine}</span>

        {description && (
          <div className="flex flex-col gap-y-1">
            <TextRich
              content={description}
              className={classNames('text-base text-content-disabled', {
                'line-clamp-1': !expanded,
              })}
            />
            <button
              type="button"
              className="self-start text-sm text-content-disabled underline"
              onClick={toggleDescription}
            >
              {expanded ? t('see_less') : t('see_more')}
            </button>
          </div>
        )}

        <SkillGroup
          skills={skills}
          max={isXL ? 3 : 2}
          initializeWithMax={2}
          total={skills.length}
          onShowAll={openModal}
        />
      </article>

      <TechnologiesModal
        open={modalOpen}
        onClose={closeModal}
        company={company}
        position={position}
        technologies={skills}
      />
    </>
  );
};
