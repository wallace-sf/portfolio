export function ValuesSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-y-6">
      <div className="h-8 w-64 rounded bg-surface-raised" />
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {(['val-1', 'val-2', 'val-3', 'val-4'] as const).map((key) => (
          <li
            key={key}
            className="flex w-full flex-col gap-y-3 rounded-xl border border-border-subtle bg-surface/20 px-4 py-6"
          >
            <div className="size-12 rounded bg-surface-raised" />
            <div className="h-4 w-full rounded bg-surface-raised" />
            <div className="h-4 w-4/5 rounded bg-surface-raised" />
            <div className="h-4 w-3/5 rounded bg-surface-raised" />
          </li>
        ))}
      </ul>
    </div>
  );
}
