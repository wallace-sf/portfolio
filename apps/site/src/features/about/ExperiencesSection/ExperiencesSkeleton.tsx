export function ExperiencesSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="my-6 h-px bg-surface-raised" />
      <ul className="flex flex-col gap-y-3">
        {(['exp-1', 'exp-2', 'exp-3'] as const).map((key) => (
          <li
            key={key}
            className="flex flex-col gap-y-3 rounded-xl bg-surface-sunken px-3 py-6"
          >
            <div className="h-5 w-3/5 rounded bg-surface-raised" />
            <div className="h-4 w-2/5 rounded bg-surface-raised" />
            <div className="h-4 w-full rounded bg-surface-raised" />
            <div className="h-4 w-5/6 rounded bg-surface-raised" />
          </li>
        ))}
      </ul>
    </div>
  );
}
