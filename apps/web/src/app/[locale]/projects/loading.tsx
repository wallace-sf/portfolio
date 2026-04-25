export default function ProjectsLoading() {
  return (
    <div className="animate-pulse" aria-busy="true" aria-label="Loading">
      {/* HeroBanner — same structure as home */}
      <section className="flex flex-col bg-dark-300 gap-y-6 xl:flex xl:flex-row xl:rounded-xl xl:h-[424px]">
        <section className="flex flex-col px-6 pb-6 xl:py-20 xl:pl-20 xl:w-1/2 gap-y-4">
          <div className="h-8 w-36 bg-gray-700 rounded" />
          <div className="h-8 w-56 bg-gray-700 rounded" />
          <div className="flex flex-col gap-y-2 pt-4">
            <div className="h-4 bg-gray-700 rounded w-full" />
            <div className="h-4 bg-gray-700 rounded w-5/6" />
            <div className="h-4 bg-gray-700 rounded w-4/6" />
          </div>
        </section>
        <section className="xl:order-1 xl:w-1/2 bg-gray-700 xl:rounded-r-xl min-h-[200px]" />
      </section>
    </div>
  );
}
