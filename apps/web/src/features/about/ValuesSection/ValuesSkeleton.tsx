export function ValuesSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 w-64 bg-gray-700 rounded mx-4 my-6 xl:mx-auto xl:max-w-237.5" />
      <ul className="flex flex-row gap-x-4 mx-4 xl:mx-auto xl:max-w-237.5">
        {(['val-1', 'val-2', 'val-3', 'val-4'] as const).map((key) => (
          <li
            key={key}
            className="w-full max-w-56 border border-dark-300 px-4 py-6 rounded-xl bg-dark-300/20 flex flex-col gap-y-3"
          >
            <div className="h-12 w-12 bg-gray-700 rounded" />
            <div className="h-4 bg-gray-700 rounded w-full" />
            <div className="h-4 bg-gray-700 rounded w-4/5" />
            <div className="h-4 bg-gray-700 rounded w-3/5" />
          </li>
        ))}
      </ul>
    </div>
  );
}
