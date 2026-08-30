import { describe, expect, it } from 'vitest';

import enUS from '~/../messages/en-US.json';
import es from '~/../messages/es.json';
import ptBR from '~/../messages/pt-BR.json';

type MessageTree = { [key: string]: string | MessageTree };

const LOCALES = { 'en-US': enUS, 'pt-BR': ptBR, es } as Record<
  string,
  MessageTree
>;

/** Every dot-joined leaf path in a message tree, sorted. */
function leafPaths(tree: MessageTree, prefix = ''): string[] {
  return Object.entries(tree)
    .flatMap(([key, value]) => {
      const path = prefix ? `${prefix}.${key}` : key;
      return typeof value === 'string' ? [path] : leafPaths(value, path);
    })
    .sort();
}

describe('site message catalogues', () => {
  const reference = leafPaths(LOCALES['en-US']!);

  it.each(['pt-BR', 'es'])(
    'should expose exactly the same keys as en-US in %s',
    (locale) => {
      const paths = leafPaths(LOCALES[locale]!);

      const missing = reference.filter((p) => !paths.includes(p));
      const extra = paths.filter((p) => !reference.includes(p));

      expect({ missing, extra }).toEqual({ missing: [], extra: [] });
    },
  );

  it.each(Object.keys(LOCALES))(
    'should carry non-empty blog listing metadata in %s',
    (locale) => {
      const blog = (LOCALES[locale]!.Metadata as MessageTree)
        .BlogPage as MessageTree;

      expect(blog?.title).toBeTruthy();
      expect(blog?.description).toBeTruthy();
    },
  );
});
