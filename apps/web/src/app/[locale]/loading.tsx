export default function HomeLoading() {
  return (
    <div className="animate-pulse" aria-busy="true" aria-label="Loading">
      {/* HeroBanner — image first in DOM (matches real component order) */}
      <section className="flex flex-col bg-dark-300 xl:flex-row xl:rounded-xl xl:h-[424px]">
        <div className="h-[220px] bg-gray-700 xl:order-1 xl:w-1/2 xl:h-full xl:rounded-r-xl" />
        <div className="flex flex-col px-6 py-6 xl:order-0 xl:py-20 xl:pl-20 xl:w-1/2 gap-y-4">
          <div className="h-8 w-3/5 bg-gray-700 rounded" />
          <div className="h-8 w-4/5 bg-gray-700 rounded" />
          <div className="flex flex-col gap-y-2 pt-4">
            <div className="h-4 bg-gray-700 rounded w-full" />
            <div className="h-4 bg-gray-700 rounded w-5/6" />
            <div className="h-4 bg-gray-700 rounded w-4/6" />
          </div>
        </div>
      </section>

      {/* Projects section title */}
      <div className="h-7 w-2/5 bg-gray-700 rounded mx-4 my-6 xl:mx-auto xl:max-w-237.5" />

      {/* ProjectList — md:grid-cols-2, 4 cards */}
      <ul className="mx-auto grid max-w-237.5 gap-4 md:grid-cols-2 xl:gap-6 pb-8 xl:pb-20 px-4 xl:px-0">
        {Array.from({ length: 4 }).map((_, i) => (
          <li key={i} className="bg-dark-300 p-3 rounded-5">
            <div className="h-[180px] xl:h-[244px] bg-gray-700 rounded-lg mb-4" />
            <div className="h-5 w-3/4 bg-gray-700 rounded mb-2" />
            <div className="h-4 w-full bg-gray-700 rounded mb-1" />
            <div className="h-4 w-5/6 bg-gray-700 rounded mb-5" />
            <div className="h-10 w-full bg-gray-700 rounded" />
          </li>
        ))}
      </ul>

      {/* Contact section */}
      <section className="flex flex-col gap-x-6 xl:flex-row mx-4 mb-8 xl:mx-auto xl:w-full xl:max-w-237.5">
        {/* ContactForm */}
        <div className="flex flex-col flex-1 gap-y-4 mb-4 xl:mb-0">
          <div className="h-6 w-2/5 bg-gray-700 rounded" />
          <div className="h-32 w-full bg-gray-700 rounded" />
          <div className="h-10 w-full bg-gray-700 rounded xl:max-w-50" />
        </div>

        {/* Divider (xl:hidden) */}
        <div className="h-px bg-gray-700 my-4 xl:hidden" />

        {/* ContactInfo */}
        <div className="flex flex-col gap-y-3 bg-dark-300 px-4 py-6 rounded-xl xl:w-72">
          <div className="h-5 w-1/4 bg-gray-700 rounded" />
          <div className="h-4 w-3/4 bg-gray-700 rounded" />
          <div className="h-5 w-1/3 bg-gray-700 rounded" />
          <div className="h-4 w-2/3 bg-gray-700 rounded" />
          <div className="h-px bg-gray-700 my-1" />
          <div className="h-4 w-full bg-gray-700 rounded" />
          <div className="h-4 w-5/6 bg-gray-700 rounded" />
          <div className="h-4 w-full bg-gray-700 rounded" />
          <div className="h-4 w-4/5 bg-gray-700 rounded" />
          <div className="h-10 w-full bg-gray-700 rounded mt-1" />
          <div className="h-10 w-full bg-gray-700 rounded" />
        </div>
      </section>
    </div>
  );
}
