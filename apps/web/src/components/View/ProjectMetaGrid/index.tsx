import { FC } from 'react';

interface IProjectMetaGridProps {
  summary?: string;
  objectives?: string;
  role?: string;
  period: { startAt: string; endAt?: string };
  labels: {
    summary: string;
    objectives: string;
    role: string;
    period: string;
  };
}

function formatPeriod(period: { startAt: string; endAt?: string }): string {
  const start = new Date(period.startAt).getUTCFullYear();
  if (!period.endAt) return String(start);
  const end = new Date(period.endAt).getUTCFullYear();
  return start === end ? String(start) : `${start} – ${end}`;
}

export const ProjectMetaGrid: FC<IProjectMetaGridProps> = ({
  summary,
  objectives,
  role,
  period,
  labels,
}) => {
  const items = [
    summary ? { label: labels.summary, value: summary } : null,
    objectives ? { label: labels.objectives, value: objectives } : null,
    role ? { label: labels.role, value: role } : null,
    { label: labels.period, value: formatPeriod(period) },
  ].filter((item): item is { label: string; value: string } => item !== null);

  return (
    <dl className="grid grid-cols-1 xl:grid-cols-2 gap-4 bg-dark-300 rounded-xl p-4">
      {items.map(({ label, value }) => (
        <div key={label} className="flex flex-col gap-y-1">
          <dt className="text-body-xs !text-dark-700 uppercase tracking-wide">
            {label}
          </dt>
          <dd className="text-body-sm !text-white">{value}</dd>
        </div>
      ))}
    </dl>
  );
};
