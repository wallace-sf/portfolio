/** One step of a breadcrumb trail; `url` is absolute. */
export interface IBreadcrumbListItem {
  name: string;
  url: string;
}

export interface IBreadcrumbListElement {
  '@type': 'ListItem';
  /** 1-based. */
  position: number;
  name: string;
  item: string;
}

/** A schema.org `BreadcrumbList` node, without `@context` (embed it in a graph or spread it). */
export interface IBreadcrumbListNode {
  '@type': 'BreadcrumbList';
  itemListElement: IBreadcrumbListElement[];
}

/** The `BreadcrumbList` JSON-LD node of a trail; positions follow input order. */
export function buildBreadcrumbListJsonLd(
  items: IBreadcrumbListItem[],
): IBreadcrumbListNode {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map(({ name, url }, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name,
      item: url,
    })),
  };
}
