import { Readability } from '@mozilla/readability';
import { render } from '@testing-library/react';

import { AppLayout } from '~/components/Layout/AppLayout';

// Site chrome outside the content wrapper, wordy enough (> 500 chars) to pass
// for an article on its own.
const NAV_ITEMS = Array.from(
  { length: 12 },
  (_, index) => `Navigation entry number ${index + 1} with a long label`,
);

vi.mock('~/components/Layout/SideNavigation', () => ({
  SideNavigation: () => (
    <nav>
      <ul>
        {NAV_ITEMS.map((item, index) => (
          <li key={item}>
            <a href={`/nav-${index}`}>{item}</a>
          </li>
        ))}
      </ul>
    </nav>
  ),
}));

vi.mock('~features/contact/ContactSection', () => ({
  ContactSection: () => <p>Contact</p>,
}));

const PARAGRAPH =
  'A paragraph long enough for the reader mode to treat this as an article. '.repeat(
    4,
  );

describe('AppLayout', () => {
  it('should let a browser reader mode extract the page article when the layout wraps it', () => {
    render(
      <AppLayout>
        <article>
          <h1>Post title</h1>
          {[1, 2, 3, 4].map((n) => (
            <p key={n}>{PARAGRAPH}</p>
          ))}
        </article>
      </AppLayout>,
    );

    // Readability (Firefox Reader View) mutates the document it parses.
    const extracted = new Readability(
      document.cloneNode(true) as Document,
    ).parse();

    expect(extracted?.textContent).toContain(PARAGRAPH.trim());
    expect(extracted?.textContent).not.toContain(NAV_ITEMS[0]);
  });
});
