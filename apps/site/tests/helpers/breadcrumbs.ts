import type { IBreadcrumbListNode } from '@repo/seo';
import { screen, within } from '@testing-library/react';
import { expect } from 'vitest';

/** A rendered breadcrumb step: its label and its href (`undefined` when current). */
export interface IRenderedCrumb {
  label: string;
  href: string | undefined;
}

/** The visible breadcrumb trail, in order. */
export function renderedBreadcrumbTrail(): IRenderedCrumb[] {
  const nav = screen.getByRole('navigation', { name: 'breadcrumb' });

  return within(nav)
    .getAllByRole('listitem')
    .map((item) => ({
      label: item.textContent ?? '',
      href: item.querySelector('a')?.getAttribute('href') ?? undefined,
    }));
}

/** The `BreadcrumbList` JSON-LD scripts rendered into `container`. */
export function renderedBreadcrumbJsonLd(
  container: HTMLElement,
): IBreadcrumbListNode[] {
  return Array.from(
    container.querySelectorAll('script[type="application/ld+json"]'),
  )
    .map((script) => JSON.parse(script.textContent ?? '{}'))
    .filter(
      (data): data is IBreadcrumbListNode => data['@type'] === 'BreadcrumbList',
    );
}

/**
 * Asserts the visible trail is `expected`, and that exactly one
 * `BreadcrumbList` JSON-LD node is rendered with the same names in order,
 * ending at `${siteUrl}/{locale}{path}` of the current page.
 */
export function expectBreadcrumbTrail(
  container: HTMLElement,
  expected: IRenderedCrumb[],
  currentPath: string,
): void {
  expect(renderedBreadcrumbTrail()).toEqual(expected);

  const nodes = renderedBreadcrumbJsonLd(container);
  expect(nodes).toHaveLength(1);

  const elements = nodes[0]?.itemListElement ?? [];
  expect(elements.map(({ name }) => name)).toEqual(
    expected.map(({ label }) => label),
  );
  expect(elements.at(-1)?.item.endsWith(currentPath)).toBe(true);
}
