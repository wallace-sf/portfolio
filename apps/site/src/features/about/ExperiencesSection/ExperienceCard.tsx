'use client';

import { FC } from 'react';

import { Icon } from '@repo/ui/Imagery';
import { TextRich } from '@repo/ui/View';
import classNames from 'classnames';
import { useLocale, useTranslations } from 'next-intl';
import { useBoolean } from 'usehooks-ts';

import { SkillGroup } from '~features/shared/SkillGroup';
import { useBreakpoint } from '~hooks';
import { formatDuration } from '~utils';

import {
  EMPLOYMENT_TYPE_ICONS,
  LOCATION_ICON,
  LOCATION_TYPE_ICONS,
} from './experienceIcons';

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
  const { value: expanded, toggle: toggleDescription } = useBoolean(false);
  const isXL = useBreakpoint('xl');

  const period = `${formatDate(startAt, locale)} - ${endAt ? formatDate(endAt, locale) : t('present')}`;
  const duration = formatDuration(startAt, locale, endAt);
  const employmentLabel = t(`employment_type.${employmentType}`);
  const locationLabel = t(`location_type.${locationType}`);
  const employmentIcon =
    EMPLOYMENT_TYPE_ICONS[employmentType] ?? 'mdi:briefcase-outline';
  const locationTypeIcon =
    LOCATION_TYPE_ICONS[locationType] ?? 'mdi:map-marker-outline';

  return (
    <article className="flex flex-col gap-y-2">
      <h2 className="text-2xl font-bold text-content-primary">{position}</h2>

      <div className="flex flex-wrap items-baseline gap-x-2">
        <span className="text-xl font-bold uppercase text-content-primary">
          {company}
        </span>
        <span className="text-base text-content-disabled">
          {period} ({duration})
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-base text-content-disabled">
        <span className="flex items-center gap-x-1">
          <Icon icon={LOCATION_ICON} className="shrink-0 text-base" />
          {location}
        </span>
        <span className="flex items-center gap-x-1">
          <Icon icon={employmentIcon} className="shrink-0 text-base" />
          {employmentLabel}
        </span>
        <span className="flex items-center gap-x-1">
          <Icon icon={locationTypeIcon} className="shrink-0 text-base" />
          {locationLabel}
        </span>
      </div>

      {description && (
        <div className="flex flex-col gap-y-1">
          <TextRich
            content={description}
            className={classNames('text-base text-content-disabled', {
              'line-clamp-3': !expanded,
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
      />
    </article>
  );
};
