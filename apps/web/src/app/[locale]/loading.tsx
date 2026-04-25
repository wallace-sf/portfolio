export default function HomeLoading() {
  return (
    <div className="animate-pulse" aria-busy="true" aria-label="Loading">
      <div className="h-64 xl:h-96 bg-gray-700 rounded-lg mx-4 my-4 xl:mx-auto xl:max-w-237.5" />
      <div className="h-8 w-40 bg-gray-700 rounded mx-4 my-6 xl:mx-auto xl:max-w-237.5" />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mx-4 xl:mx-auto xl:max-w-237.5 pb-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-48 bg-gray-700 rounded-lg" />
        ))}
      </div>
      <div className="h-64 bg-gray-700 rounded mx-4 xl:mx-auto xl:max-w-237.5" />
    </div>
  );
}
