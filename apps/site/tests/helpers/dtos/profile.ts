import type { ProfileDTO } from '@repo/application/portfolio';

/**
 * A `ProfileDTO` as `GetProfile` returns it to a page. Override only what the
 * scenario checks (e.g. `{ stats: [] }`).
 */
export function buildProfileDTO(
  overrides: Partial<ProfileDTO> = {},
): ProfileDTO {
  return {
    id: '1',
    name: 'Wallace Ferreira',
    headline: 'Frontend Engineer',
    bio: 'Bio text.',
    photo: { url: 'https://example.com/photo.jpg', alt: 'Profile photo' },
    stats: [{ label: 'Years', value: '6+', icon: 'mdi:calendar' }],
    socialNetworks: [],
    ...overrides,
  };
}
