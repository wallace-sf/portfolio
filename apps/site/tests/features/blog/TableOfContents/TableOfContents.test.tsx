/**
 * @vitest-environment jsdom
 */
import { act, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { MarkdownHeading } from '@repo/ui/View';

import { TableOfContents } from '~features/blog/TableOfContents';

const HEADINGS: MarkdownHeading[] = [
  { id: 'why', text: 'Why', depth: 2 },
  { id: 'left', text: 'The Left side', depth: 3 },
  { id: 'right', text: 'The Right side', depth: 3 },
  { id: 'usage', text: 'Usage', depth: 2 },
];

/** Mounts heading elements whose viewport `top` is given per id. */
function mountHeadings(tops: Record<string, number>) {
  Object.entries(tops).forEach(([id, top]) => {
    const element = document.createElement('h2');
    element.id = id;
    element.getBoundingClientRect = () => ({ top }) as DOMRect;
    document.body.appendChild(element);
  });
}

/** Headings scrolled to `tops`, then the window reports the scroll. */
function scrollTo(tops: Record<string, number>) {
  Object.entries(tops).forEach(([id, top]) => {
    const element = document.getElementById(id) as HTMLElement;
    element.getBoundingClientRect = () => ({ top }) as DOMRect;
  });
  act(() => {
    window.dispatchEvent(new Event('scroll'));
  });
}

const current = () =>
  screen
    .queryAllByRole('link')
    .filter((link) => link.getAttribute('aria-current') === 'location')
    .map((link) => link.textContent);

beforeEach(() => {
  // Run the once-per-frame update synchronously.
  vi.stubGlobal('requestAnimationFrame', (update: FrameRequestCallback) => {
    update(0);
    return 0;
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
  document.body.innerHTML = '';
});

describe('TableOfContents', () => {
  it('should nest h3 entries under the preceding h2 and link each to its anchor', () => {
    render(<TableOfContents headings={HEADINGS} label="On this page" />);

    const nav = screen.getByRole('navigation', { name: 'On this page' });
    const why = within(nav).getByRole('link', { name: 'Why' });
    const nested = within(why.closest('li') as HTMLElement).getAllByRole(
      'link',
    );

    expect(nested.map((link) => link.getAttribute('href'))).toEqual([
      '#why',
      '#left',
      '#right',
    ]);
    expect(within(nav).getByRole('link', { name: 'Usage' })).toHaveAttribute(
      'href',
      '#usage',
    );
  });

  it('should mark the last heading scrolled past as the current location', () => {
    mountHeadings({ why: 900, left: 1400, right: 1900, usage: 2400 });
    render(<TableOfContents headings={HEADINGS} label="On this page" />);

    scrollTo({ why: -400, left: 60, right: 500, usage: 1000 });
    expect(current()).toEqual(['The Left side']);

    scrollTo({ why: 500, left: 900, right: 1300, usage: 1800 });
    expect(current()).toEqual([]);
  });

  it('should colour the current entry like its heading when it is an h2 or an h3', () => {
    mountHeadings({ why: 900, left: 1400, right: 1900, usage: 2400 });
    render(<TableOfContents headings={HEADINGS} label="On this page" />);
    const link = (name: string) => screen.getByRole('link', { name });

    scrollTo({ why: 0, left: 500, right: 1000, usage: 1500 });
    expect(link('Why')).toHaveClass(
      'text-brand-accent',
      '[.light_&]:text-brand-primary',
    );

    scrollTo({ why: -500, left: 0, right: 500, usage: 1000 });
    expect(link('The Left side')).toHaveClass('text-brand-primary');
    expect(link('The Left side')).not.toHaveClass('text-brand-accent');
  });

  it('should mark the heading an anchor jump lands on when it skips past the offset', () => {
    mountHeadings({ why: 900, left: 1400, right: 1900, usage: 2400 });
    render(<TableOfContents headings={HEADINGS} label="On this page" />);

    scrollTo({ why: -1100, left: -600, right: -100, usage: 24 });
    expect(current()).toEqual(['Usage']);
  });
});
