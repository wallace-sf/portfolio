export function HeroBannerSkeleton() {
  return (
    <section className="flex animate-pulse flex-col gap-y-6 bg-surface lg:h-106 lg:flex-row lg:rounded-xl">
      <div className="flex flex-col gap-y-4 px-6 pb-6 lg:w-1/2 lg:py-20 lg:pl-20">
        <div className="h-8 w-48 rounded bg-surface-raised" />
        <div className="h-8 w-64 rounded bg-surface-raised" />
        <div className="flex flex-col gap-y-2 pt-4">
          <div className="h-4 w-full rounded bg-surface-raised" />
          <div className="h-4 w-5/6 rounded bg-surface-raised" />
          <div className="h-4 w-4/6 rounded bg-surface-raised" />
        </div>
      </div>
      <div className="min-h-50 bg-surface-raised lg:order-1 lg:w-1/2 lg:rounded-r-xl" />
    </section>
  );
}
