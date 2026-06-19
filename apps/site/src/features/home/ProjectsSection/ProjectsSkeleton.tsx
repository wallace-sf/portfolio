export function ProjectsSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="my-6 flex w-full justify-start lg:mx-auto lg:max-w-237.5">
        <div className="h-8 w-32 rounded bg-surface-raised" />
      </div>
      <ul className="grid max-w-237.5 grid-cols-1 gap-4 pb-8 lg:mx-auto lg:grid-cols-2 lg:gap-6 lg:pb-20">
        {(['card-1', 'card-2', 'card-3', 'card-4'] as const).map((key) => (
          <li key={key} className="rounded-5 bg-surface p-3">
            <div className="mb-4 h-45 rounded-lg bg-surface-raised lg:h-61" />
            <div className="mb-2 h-5 w-3/4 rounded bg-surface-raised" />
            <div className="mb-1 h-4 rounded bg-surface-raised" />
            <div className="mb-5 h-4 w-5/6 rounded bg-surface-raised" />
            <div className="h-10 rounded bg-surface-raised" />
          </li>
        ))}
      </ul>
    </div>
  );
}
