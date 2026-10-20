import { describe, expect, it } from 'vitest';

import { shareLinks } from '~features/shared/shareLinks';

const URL_ = 'https://example.dev/pt-BR/blog/2026/10/post';
const TITLE = 'Quando o trabalho é extraordinário & mais';
const ENC_URL = encodeURIComponent(URL_);
const ENC_TITLE = encodeURIComponent(TITLE);

const hrefOf = (network: string) =>
  shareLinks(URL_, TITLE).find((link) => link.network === network)?.href;

describe('shareLinks', () => {
  it('should list one link per supported network when called', () => {
    expect(shareLinks(URL_, TITLE).map(({ network }) => network)).toEqual([
      'LinkedIn',
      'X',
      'Bluesky',
      'WhatsApp',
      'Reddit',
      'Hacker News',
    ]);
  });

  it.each([
    [
      'LinkedIn',
      `https://www.linkedin.com/sharing/share-offsite/?url=${ENC_URL}`,
    ],
    ['X', `https://x.com/intent/post?text=${ENC_TITLE}&url=${ENC_URL}`],
    [
      'Bluesky',
      `https://bsky.app/intent/compose?text=${encodeURIComponent(`${TITLE} ${URL_}`)}`,
    ],
    [
      'WhatsApp',
      `https://wa.me/?text=${encodeURIComponent(`${TITLE} ${URL_}`)}`,
    ],
    [
      'Reddit',
      `https://www.reddit.com/submit?url=${ENC_URL}&title=${ENC_TITLE}`,
    ],
    [
      'Hacker News',
      `https://news.ycombinator.com/submitlink?u=${ENC_URL}&t=${ENC_TITLE}`,
    ],
  ])(
    'should build the %s share link with the encoded url and title when called',
    (network, expected) => {
      expect(hrefOf(network)).toBe(expected);
    },
  );
});
