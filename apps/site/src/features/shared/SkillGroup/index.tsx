'use client';

import { FC, useMemo, useState } from 'react';

import { Badge } from '@repo/ui/View';
import { useIsomorphicLayoutEffect, useBoolean } from 'usehooks-ts';

import { TechnologiesModal } from '~/features/shared/TechnologiesModal';

export type SkillSummary = { name: string; icon: string };

interface ISkillGroupProps {
  max: number;
  total: number;
  skills: SkillSummary[];
  initializeWithMax: number;
}

export const SkillGroup: FC<ISkillGroupProps> = ({
  max,
  skills,
  total,
  initializeWithMax,
}) => {
  const [storedMax, setStoredMax] = useState<number>(initializeWithMax);
  const {
    value: modalOpen,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBoolean(false);

  const renderedSkills = useMemo(
    () =>
      skills.slice(0, storedMax).map((skill) =>
        skill.icon ? (
          <li key={skill.name}>
            <Badge.WithIcon label={skill.name} icon={skill.icon} />
          </li>
        ) : (
          <li key={skill.name}>
            <Badge.Text label={skill.name} />
          </li>
        ),
      ),
    [skills, storedMax],
  );

  useIsomorphicLayoutEffect(() => {
    setStoredMax(max);
  }, [max]);

  return (
    <>
      <ul className="flex flex-row gap-2 flex-wrap">
        {renderedSkills}
        {skills.length > storedMax ? (
          <li>
            {modalOpen ? (
              <Badge.Count count={total - storedMax} />
            ) : (
              <button
                type="button"
                className="hover:opacity-80 transition-opacity"
                onClick={openModal}
              >
                <Badge.Count count={total - storedMax} />
              </button>
            )}
          </li>
        ) : null}
      </ul>
      <TechnologiesModal
        open={modalOpen}
        onClose={closeModal}
        technologies={skills}
      />
    </>
  );
};
