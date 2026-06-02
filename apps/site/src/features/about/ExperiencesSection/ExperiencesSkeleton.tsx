export function ExperiencesSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-px bg-gray-700 mx-4 my-6 xl:mx-auto xl:max-w-237.5" />
      <ul className="flex flex-col mx-4 gap-y-3 xl:mx-auto xl:max-w-237.5">
        {(['exp-1', 'exp-2', 'exp-3'] as const).map((key) => (
          <li
            key={key}
            className="flex flex-col py-6 px-3 bg-surface-sunken rounded-xl gap-y-3"
          >
            <div className="h-5 w-3/5 bg-gray-700 rounded" />
            <div className="h-4 w-2/5 bg-gray-700 rounded" />
            <div className="h-4 bg-gray-700 rounded w-full" />
            <div className="h-4 bg-gray-700 rounded w-5/6" />
          </li>
        ))}
      </ul>
    </div>
  );
}
