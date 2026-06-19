'use client';

import { FC, useState } from 'react';

import { Accordion, Modal } from '@repo/ui/Control';
import { Icon } from '@repo/ui/Imagery';
import { Badge } from '@repo/ui/View';
import { useTranslations } from 'next-intl';

export interface ITechnology {
  name: string;
  icon: string;
  description?: string;
}

export interface ITechnologiesModalProps {
  open: boolean;
  onClose: () => void;
  company?: string;
  position?: string;
  technologies: ITechnology[];
}

export const TechnologiesModal: FC<ITechnologiesModalProps> = ({
  open,
  onClose,
  company,
  position,
  technologies,
}) => {
  const tCommon = useTranslations('Common');
  const t = useTranslations('TechnologiesModal');
  const hasDescriptions = technologies.some((tech) => tech.description);
  const [view, setView] = useState<'basic' | 'detailed'>('basic');
  const isDetailed = view === 'detailed';

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeLabel={tCommon('close')}
      title={t('title')}
    >
      {(company || position || hasDescriptions) && (
        <div className="mb-6 flex items-center gap-3">
          {company && (
            <span className="text-xl font-bold text-content-primary">
              {company}
            </span>
          )}
          {position && (
            <span className="text-base font-normal text-content-primary">
              {position}
            </span>
          )}
          {hasDescriptions && (
            <button
              type="button"
              onClick={() => setView(isDetailed ? 'basic' : 'detailed')}
              className="text-body-xs ml-auto text-brand-primary transition-opacity hover:opacity-80"
            >
              {isDetailed ? t('compactView') : t('viewDetails')}
            </button>
          )}
        </div>
      )}

      {isDetailed && <hr className="mb-6 border-t border-border-muted" />}

      {isDetailed ? (
        <ul className="flex flex-col gap-3">
          {technologies.map((tech, index) => (
            <li key={tech.name}>
              <Accordion.Root>
                {({ expanded }) => (
                  <>
                    <Accordion.Header className="py-3">
                      <div className="flex items-center gap-3">
                        {tech.icon && (
                          <Icon
                            icon={tech.icon}
                            className="min-w-fit text-2xl"
                          />
                        )}
                        <span className="text-base font-bold text-content-primary">
                          {tech.name}
                        </span>
                      </div>
                      <Icon
                        icon="ic:round-keyboard-arrow-down"
                        className={`text-xl text-content-muted transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
                      />
                    </Accordion.Header>
                    <Accordion.Body>
                      <p className="pb-3 text-sm font-normal leading-[1.4] text-content-secondary">
                        {tech.description}
                      </p>
                    </Accordion.Body>
                  </>
                )}
              </Accordion.Root>
              {index < technologies.length - 1 && (
                <hr className="border-t border-border-default" />
              )}
            </li>
          ))}
        </ul>
      ) : (
        <ul className="flex flex-row flex-wrap gap-3">
          {technologies.map((tech) => (
            <li key={tech.name}>
              {tech.icon ? (
                <Badge.WithIcon label={tech.name} icon={tech.icon} />
              ) : (
                <Badge.Text label={tech.name} />
              )}
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
};
