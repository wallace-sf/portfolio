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

type AsyncComponent = (props: object) => Promise<ReactNode>;

const isAsyncComponent = (type: unknown): type is AsyncComponent =>
  typeof type === 'function' && type.constructor.name === 'AsyncFunction';

/**
 * Expands every async Server Component reachable through `children`, so the
 * tree can be rendered by React DOM (which cannot render async components).
 * Sync components are left to React. Limitation: an async component that only
 * a *sync* component renders (inside its body) is not reached — mock that
 * boundary or render it directly instead.
 */
async function resolveAsync(node: ReactNode): Promise<ReactNode> {
  if (Array.isArray(node)) return Promise.all(node.map(resolveAsync));
  if (!isValidElement<{ children?: ReactNode }>(node)) return node;

  if (isAsyncComponent(node.type)) {
    return resolveAsync(await node.type(node.props));
  }

  const { children } = node.props;
  if (children === undefined) return node;

  const resolved = await Promise.all(
    Children.toArray(children).map(resolveAsync),
  );
  return cloneElement(node, undefined, ...resolved);
}

const withIntl =
  (locale: string) =>
  ({ children }: PropsWithChildren) => (
    <NextIntlClientProvider locale={locale} messages={{}}>
      {children}
    </NextIntlClientProvider>
  );

/**
 * `render` with the next-intl client context in place, so the real `Link` from
 * `~/i18n/routing` produces locale-prefixed hrefs. `rerender` keeps the context.
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
