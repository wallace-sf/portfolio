import {
  Children,
  cloneElement,
  isValidElement,
  type PropsWithChildren,
  type ReactElement,
  type ReactNode,
} from 'react';

import { render, type RenderResult } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';

import { type CatalogueLocale, CATALOGUES } from './messages';

type AsyncComponent = (props: object) => Promise<ReactNode>;

const isAsyncComponent = (type: unknown): type is AsyncComponent =>
  typeof type === 'function' && type.constructor.name === 'AsyncFunction';

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' &&
  value !== null &&
  Object.getPrototypeOf(value) === Object.prototype;

/**
 * A prop value with every async component inside it expanded: an element, an
 * array of them, or a plain object of them (e.g. `cards` keyed by slug).
 * Anything else is returned as is.
 */
async function resolveValue(value: unknown): Promise<unknown> {
  if (Array.isArray(value) || isValidElement(value)) {
    return resolveAsync(value as ReactNode);
  }
  if (!isPlainObject(value)) return value;

  const entries = await Promise.all(
    Object.entries(value).map(
      async ([key, item]) => [key, await resolveValue(item)] as const,
    ),
  );
  return Object.fromEntries(entries);
}

/**
 * Expands every async Server Component reachable through an element's props,
 * `children` included, so the tree can be rendered by React DOM (which cannot
 * render async components). This mirrors RSC, where a Server Component passed
 * as a prop to a Client Component (`before`, `cards`) is rendered on the
 * server. Sync components are left to React. Limitation: an async component
 * that only a *sync* component renders (inside its body) is not reached —
 * mock that boundary or render it directly instead.
 */
async function resolveAsync(node: ReactNode): Promise<ReactNode> {
  if (Array.isArray(node)) return Promise.all(node.map(resolveAsync));
  if (!isValidElement<Record<string, unknown>>(node)) return node;

  if (isAsyncComponent(node.type)) {
    return resolveAsync(await node.type(node.props));
  }

  const { children, ...rest } = node.props;
  const resolvedProps = Object.fromEntries(
    await Promise.all(
      Object.entries(rest).map(
        async ([key, value]) => [key, await resolveValue(value)] as const,
      ),
    ),
  );
  if (children === undefined) return cloneElement(node, resolvedProps);

  const resolved = await Promise.all(
    Children.toArray(children as ReactNode).map(resolveAsync),
  );
  return cloneElement(node, resolvedProps, ...resolved);
}

const withIntl =
  (locale: string) =>
  ({ children }: PropsWithChildren) => (
    <NextIntlClientProvider
      locale={locale}
      messages={CATALOGUES[locale as CatalogueLocale]}
    >
      {children}
    </NextIntlClientProvider>
  );

/**
 * `render` with the next-intl client context in place, backed by the real
 * catalogues: the real `Link` from `~/i18n/routing` produces locale-prefixed
 * hrefs and `useTranslations` in client components resolves real strings.
 * `rerender` keeps the context.
 */
export function renderWithIntl(
  ui: ReactElement,
  { locale = 'en-US' }: { locale?: string } = {},
): RenderResult {
  return render(ui, { wrapper: withIntl(locale) });
}

/**
 * Renders a Server Component tree in jsdom the way the app serves it: nested
 * async components resolved, inside the next-intl client context.
 */
export async function renderServerComponent(
  element: ReactNode | Promise<ReactNode>,
  { locale = 'en-US' }: { locale?: string } = {},
): Promise<RenderResult> {
  const tree = await resolveAsync(await element);
  return renderWithIntl(<>{tree}</>, { locale });
}
