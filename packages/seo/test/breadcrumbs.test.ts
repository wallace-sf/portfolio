import { describe, expect, it } from 'vitest';

import { buildBreadcrumbListJsonLd } from '../src/breadcrumbs';

describe('buildBreadcrumbListJsonLd', () => {
  it('should number items from 1 in input order when given several items', () => {
    const node = buildBreadcrumbListJsonLd([
      { name: 'Home', url: 'https://example.com/en-US' },
      { name: 'Blog', url: 'https://example.com/en-US/blog' },
      { name: '2026', url: 'https://example.com/en-US/blog/2026' },
    ]);

    expect(node.itemListElement.map(({ position }) => position)).toEqual([
      1, 2, 3,
    ]);
    expect(node.itemListElement.map(({ name }) => name)).toEqual([
      'Home',
      'Blog',
      '2026',
    ]);
  });

  it('should map name and url to ListItem name and item when building a node', () => {
    const node = buildBreadcrumbListJsonLd([
      { name: 'Home', url: 'https://example.com/en-US' },
    ]);

    expect(node).toEqual({
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://example.com/en-US',
        },
      ],
    });
  });

  it('should return an empty list when given no items', () => {
    expect(buildBreadcrumbListJsonLd([]).itemListElement).toEqual([]);
  });
});
