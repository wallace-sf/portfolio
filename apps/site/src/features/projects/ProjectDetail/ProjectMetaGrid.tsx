import { FC } from 'react';

interface IProjectMetaGridProps {
  role?: string;
  labels: {
    role: string;
  };
}

export const ProjectMetaGrid: FC<IProjectMetaGridProps> = ({
  role,
  labels,
}) => {
  if (!role) return null;

  return (
    <dl className="flex flex-row flex-wrap gap-x-10 gap-y-4">
      <div className="flex flex-col gap-y-1">
        <dt className="text-base font-bold text-content-primary">
          {labels.role}
        </dt>
        <dd className="text-base text-content-primary">{role}</dd>
      </div>
    </dl>
  );
};
