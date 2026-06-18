export function HeroBannerSkeleton() {
  return (
    <section className="animate-pulse flex flex-col bg-surface gap-y-6 lg:flex-row lg:rounded-xl lg:h-106">
      <div className="flex flex-col px-6 pb-6 lg:py-20 lg:pl-20 lg:w-1/2 gap-y-4">
        <div className="h-8 w-48 bg-surface-raised rounded" />
        <div className="h-8 w-64 bg-surface-raised rounded" />
        <div className="flex flex-col gap-y-2 pt-4">
          <div className="h-4 bg-surface-raised rounded w-full" />
          <div className="h-4 bg-surface-raised rounded w-5/6" />
          <div className="h-4 bg-surface-raised rounded w-4/6" />
        </div>
      </div>
      <div className="lg:order-1 lg:w-1/2 bg-surface-raised lg:rounded-r-xl min-h-50" />
    </section>
  );
}
