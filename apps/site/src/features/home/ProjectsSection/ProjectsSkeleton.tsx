export function ProjectsSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="w-full flex justify-start my-6 lg:mx-auto lg:max-w-237.5">
        <div className="h-8 w-32 bg-surface-raised rounded" />
      </div>
      <ul className="lg:mx-auto grid grid-cols-1 lg:grid-cols-2 max-w-237.5 gap-4 lg:gap-6 pb-8 lg:pb-20">
        {(['card-1', 'card-2', 'card-3', 'card-4'] as const).map((key) => (
          <li key={key} className="bg-surface p-3 rounded-5">
            <div className="h-45 lg:h-61 bg-surface-raised rounded-lg mb-4" />
            <div className="h-5 w-3/4 bg-surface-raised rounded mb-2" />
            <div className="h-4 bg-surface-raised rounded mb-1" />
            <div className="h-4 w-5/6 bg-surface-raised rounded mb-5" />
            <div className="h-10 bg-surface-raised rounded" />
          </li>
        ))}
      </ul>
    </div>
  );
}
