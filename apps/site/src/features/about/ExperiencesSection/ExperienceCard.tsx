'use client';

import { FC, useCallback } from 'react';

import { TextRich } from '@repo/ui/View';
import classNames from 'classnames';
import { useLocale, useTranslations } from 'next-intl';
import { useBoolean, useScrollLock } from 'usehooks-ts';

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

const MAX_VISIBLE_SKILLS = 3;

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
  const { lock, unlock } = useScrollLock({ autoLock: false });
  const {
    value: modalOpen,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBoolean(false);
  const { value: expanded, toggle: toggleDescription } = useBoolean(false);

  const handleOpenModal = useCallback(() => {
    openModal();
    lock();
  }, [openModal, lock]);

  const handleCloseModal = useCallback(() => {
    closeModal();
    unlock();
  }, [closeModal, unlock]);

  const period = `${formatDate(startAt, locale)} - ${endAt ? formatDate(endAt, locale) : t('present')}`;
  const duration = calculateDuration(startAt, endAt);
  const locationLine = [location, employmentType, locationType]
    .filter(Boolean)
    .join(' • ');
  const visibleSkills = skills.slice(0, MAX_VISIBLE_SKILLS);
  const extraCount = skills.length - MAX_VISIBLE_SKILLS;

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

        {skills.length > 0 && (
          <ul className="flex flex-row flex-wrap gap-3">
            {visibleSkills.map((skill) => (
              <li key={skill.name}>
                <span className="inline-flex items-center bg-surface-interactive rounded-[15px] h-7 px-3 py-1 text-sm text-content-primary">
                  {skill.name}
                </span>
              </li>
            ))}
            {extraCount > 0 && (
              <li>
                <button
                  type="button"
                  className="inline-flex items-center bg-surface-interactive rounded-[15px] h-7 px-3 py-1 text-sm text-content-primary"
                  onClick={handleOpenModal}
                >
                  +{extraCount}
                </button>
              </li>
            )}
          </ul>
        )}
      </article>

      <TechnologiesModal
        open={modalOpen}
        onClose={handleCloseModal}
        company={company}
        position={position}
        technologies={skills}
      />
    </>
  );
};
