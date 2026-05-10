import { getTranslations } from 'next-intl/server';

export default async function AboutLoading() {
  const t = await getTranslations('Common');
  return (
    <div className="animate-pulse" aria-busy="true" aria-label={t('loading')}>
      {/* Section title */}
      <div className="h-8 w-64 bg-gray-700 rounded mx-4 my-6 xl:mx-auto xl:max-w-237.5" />

      {/* ProfessionalValue cards — max-w-56, border, rounded-xl, flex row */}
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

      {/* Divider */}
      <div className="h-px bg-gray-700 mx-4 my-6 xl:mx-auto xl:max-w-237.5" />

      {/* ExperienceCard list — bg-dark-200, rounded-xl */}
      <ul className="flex flex-col mx-4 gap-y-3 xl:mx-auto xl:max-w-237.5">
        {(['exp-1', 'exp-2', 'exp-3'] as const).map((key) => (
          <li
            key={key}
            className="flex flex-col py-6 px-3 bg-dark-200 rounded-xl gap-y-3"
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
