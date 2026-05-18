import { getTranslations } from 'next-intl/server';

export default async function ProjectDetailLoading() {
  const t = await getTranslations('Common');
  return (
    <div className="animate-pulse" aria-busy="true" aria-label={t('loading')}>
      <div className="w-full h-60 xl:h-100 bg-gray-700" />
      <div className="mx-4 xl:mx-auto xl:max-w-237.5 flex flex-col gap-y-6 mt-8">
        <div className="flex gap-x-2">
          {[12, 16, 24].map((w) => (
            <div key={w} className={`h-4 w-${w} bg-gray-700 rounded`} />
          ))}
        </div>
        <div className="flex flex-col gap-y-2">
          <div className="h-8 w-3/4 bg-gray-700 rounded" />
          <div className="h-4 w-1/4 bg-gray-700 rounded" />
          <div className="h-4 w-full bg-gray-700 rounded" />
        </div>
        <div className="flex gap-x-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-6 w-16 bg-gray-700 rounded-full" />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4 bg-surface rounded-xl p-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col gap-y-1">
              <div className="h-3 w-16 bg-gray-700 rounded" />
              <div className="h-4 w-24 bg-gray-700 rounded" />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-y-2">
          {(['w-full', 'w-[90%]', 'w-[95%]', 'w-4/5', 'w-[85%]'] as const).map(
            (w) => (
              <div key={w} className={`h-4 bg-gray-700 rounded ${w}`} />
            ),
          )}
        </div>
      </div>
    </div>
  );
}
