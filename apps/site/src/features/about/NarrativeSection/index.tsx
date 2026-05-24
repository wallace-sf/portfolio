import { getTranslations } from 'next-intl/server';

interface NarrativeCardProps {
  title: string;
  content: string;
}

function NarrativeCard({ title, content }: NarrativeCardProps) {
  return (
    <article className="flex flex-col gap-y-3 border border-subtle rounded-xl px-6 py-6 bg-surface/20">
      <h3 className="text-white font-semibold text-lg">{title}</h3>
      <p className="text-content-primary leading-relaxed">{content}</p>
    </article>
  );
}

export async function NarrativeSection() {
  const t = await getTranslations('About');

  return (
    <section
      data-testid="narrative-section"
      className="mx-4 my-6 flex flex-col gap-y-4 xl:mx-auto xl:my-8 xl:w-full xl:max-w-237.5"
    >
      <NarrativeCard title={t('story_title')} content={t('story_content')} />
      <NarrativeCard
        title={t('exploring_title')}
        content={t('exploring_content')}
      />
      <NarrativeCard
        title={t('passions_title')}
        content={t('passions_content')}
      />
    </section>
  );
}
