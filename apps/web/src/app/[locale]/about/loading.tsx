export default function AboutLoading() {
  return (
    <div className="animate-pulse" aria-busy="true" aria-label="Loading">
      <div className="h-8 w-64 bg-gray-700 rounded mx-4 my-6 xl:mx-auto xl:max-w-237.5" />
      <div className="flex flex-row gap-x-4 mx-4 xl:mx-auto xl:max-w-237.5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 w-full bg-gray-700 rounded-lg" />
        ))}
      </div>
      <div className="h-px bg-gray-700 mx-4 my-6 xl:mx-auto xl:max-w-237.5" />
      <div className="flex flex-col mx-4 gap-y-3 xl:mx-auto xl:max-w-237.5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-24 bg-gray-700 rounded-lg" />
        ))}
      </div>
    </div>
  );
}
