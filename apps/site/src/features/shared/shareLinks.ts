export type ShareNetwork =
  | 'LinkedIn'
  | 'X'
  | 'Bluesky'
  | 'WhatsApp'
  | 'Reddit'
  | 'Hacker News';

export interface ShareLink {
  network: ShareNetwork;
  /** Iconify icon name. */
  icon: string;
  href: string;
}

const withQuery = (base: string, params: Record<string, string>): string =>
  `${base}?${Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&')}`;

/**
 * Each network's "share this page" link for an absolute `url` and its
 * `title`. Values are percent-encoded (not `+` for spaces), which every one of
 * these endpoints decodes the same way.
 */
export const shareLinks = (url: string, title: string): ShareLink[] => [
  {
    network: 'LinkedIn',
    icon: 'mdi:linkedin',
    href: withQuery('https://www.linkedin.com/sharing/share-offsite/', { url }),
  },
  {
    network: 'X',
    icon: 'ri:twitter-x-fill',
    href: withQuery('https://x.com/intent/post', { text: title, url }),
  },
  {
    network: 'Bluesky',
    icon: 'ri:bluesky-fill',
    href: withQuery('https://bsky.app/intent/compose', {
      text: `${title} ${url}`,
    }),
  },
  {
    network: 'WhatsApp',
    icon: 'mdi:whatsapp',
    href: withQuery('https://wa.me/', { text: `${title} ${url}` }),
  },
  {
    network: 'Reddit',
    icon: 'mdi:reddit',
    href: withQuery('https://www.reddit.com/submit', { url, title }),
  },
  {
    network: 'Hacker News',
    icon: 'simple-icons:ycombinator',
    href: withQuery('https://news.ycombinator.com/submitlink', {
      u: url,
      t: title,
    }),
  },
];
