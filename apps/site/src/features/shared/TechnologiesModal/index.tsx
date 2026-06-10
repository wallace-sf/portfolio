'use client';

import { FC, useState } from 'react';

import { Accordion, Modal } from '@repo/ui/Control';
import { Icon } from '@repo/ui/Imagery';
import { useTranslations } from 'next-intl';
import { useScrollLock } from 'usehooks-ts';

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
  const t = useTranslations('Common');
  const hasDescriptions = technologies.some((tech) => tech.description);
  const [view, setView] = useState<'basic' | 'detailed'>('basic');
  const isDetailed = view === 'detailed';

  useScrollLock({ autoLock: open });

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeLabel={t('close')}
      title="Tecnologias utilizadas"
    >
      {(company || position || hasDescriptions) && (
        <div className="flex items-center gap-3 mb-6">
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
              className="ml-auto text-body-xs text-brand-primary hover:opacity-80 transition-opacity"
            >
              {isDetailed ? 'Visão compacta' : 'Ver detalhes'}
            </button>
          )}
        </div>
      )}

      {isDetailed && <hr className="border-t border-border-muted mb-6" />}

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
                            className="text-2xl min-w-fit"
                          />
                        )}
                        <span className="text-base font-bold text-content-primary">
                          {tech.name}
                        </span>
                      </div>
                      <Icon
                        icon="ic:round-keyboard-arrow-down"
                        className={`text-content-muted text-xl transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
                      />
                    </Accordion.Header>
                    <Accordion.Body>
                      <p className="text-sm font-normal text-content-secondary leading-[1.4] pb-3">
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
        <ul className="flex flex-row gap-3 flex-wrap">
          {technologies.map((tech) => (
            <li key={tech.name}>
              <span className="inline-flex items-center gap-2.5 bg-surface-interactive rounded-[44px] px-3 py-2 h-[38px]">
                {tech.icon && (
                  <Icon icon={tech.icon} className="text-xl min-w-fit" />
                )}
                <span className="text-base font-normal text-content-primary">
                  {tech.name}
                </span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
};
