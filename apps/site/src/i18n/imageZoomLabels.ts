import type { ZoomableImageLabels } from '@repo/ui/View';
import { getTranslations } from 'next-intl/server';

/** The Markdown image zoom viewer's labels in `locale`. */
export async function imageZoomLabels(
  locale: string,
): Promise<ZoomableImageLabels> {
  const t = await getTranslations({ locale, namespace: 'ImageZoom' });
  return { zoom: t('zoom'), close: t('close') };
}
