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
  const metaItems = [
    role ? { label: labels.role, value: role } : null,
    { label: labels.period, value: formatPeriod(period) },
  ].filter((item): item is { label: string; value: string } => item !== null);

  const hasCards = summary || objectives;

  return (
    <div className="flex flex-col gap-y-6">
      {hasCards && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {summary && (
            <div className="bg-surface rounded-xl p-6 flex flex-col gap-y-2 sm:h-[150px]">
              <dt className="text-xl font-bold text-content-muted">
                {labels.summary}
              </dt>
              <dd className="text-base text-content-primary">{summary}</dd>
            </div>
          )}
          {objectives && (
            <div className="bg-surface rounded-xl p-6 flex flex-col gap-y-2 sm:h-[150px]">
              <dt className="text-xl font-bold text-content-muted">
                {labels.objectives}
              </dt>
              <dd className="text-base text-content-primary">{objectives}</dd>
            </div>
          )}
        </div>
      )}

      {metaItems.length > 0 && (
        <dl className="flex flex-row flex-wrap gap-x-10 gap-y-4">
          {metaItems.map(({ label, value }) => (
            <div key={label} className="flex flex-col gap-y-1">
              <dt className="text-base font-bold text-content-primary">
                {label}
              </dt>
              <dd className="text-base text-content-primary">{value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
};
