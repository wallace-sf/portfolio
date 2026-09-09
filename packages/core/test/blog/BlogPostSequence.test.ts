import { BlogPost, BlogPostSequence, IBlogPostProps } from '~/index';
import { Slug } from '~/shared';

const BASE: IBlogPostProps = {
  slug: 'a-post',
  title: { 'en-US': 'T', 'pt-BR': 'T', es: 'T' },
  description: { 'en-US': 'D', 'pt-BR': 'D', es: 'D' },
  content: { 'en-US': 'C', 'pt-BR': 'C', es: 'C' },
  tags: ['nextjs'],
  publishedAt: '2026-08-01T00:00:00.000Z',
};

function makePost(slug: string, publishedAt: string): BlogPost {
  const result = BlogPost.create({ ...BASE, slug, publishedAt });
  if (result.isLeft()) throw result.value;
  return result.value;
}

function slug(value: string): Slug {
  const result = Slug.create(value);
  if (result.isLeft()) throw result.value;
  return result.value;
}

const older = makePost('older', '2026-08-08T00:00:00.000Z');
const middle = makePost('middle', '2026-08-15T00:00:00.000Z');
const newer = makePost('newer', '2026-08-22T00:00:00.000Z');

describe('BlogPostSequence', () => {
  describe('neighboursOf', () => {
    it('should return the newer and older post for a target in the middle', () => {
      const result = BlogPostSequence.neighboursOf(
        [newer, older, middle],
        slug('middle'),
      );

      expect(result).not.toBeNull();
      expect(result?.newer?.slug.value).toBe('newer');
      expect(result?.older?.slug.value).toBe('older');
    });

    it('should return only an older post for the most recent target', () => {
      const result = BlogPostSequence.neighboursOf(
        [newer, older, middle],
        slug('newer'),
      );

      expect(result?.newer).toBeUndefined();
      expect(result?.older?.slug.value).toBe('middle');
    });

    it('should return only a newer post for the earliest target', () => {
      const result = BlogPostSequence.neighboursOf(
        [newer, older, middle],
        slug('older'),
      );

      expect(result?.newer?.slug.value).toBe('middle');
      expect(result?.older).toBeUndefined();
    });

    it('should return both undefined when the target is the only post', () => {
      const result = BlogPostSequence.neighboursOf([middle], slug('middle'));

      expect(result).toEqual({ newer: undefined, older: undefined });
    });

    it('should return null when the target is not among the posts', () => {
      const result = BlogPostSequence.neighboursOf(
        [newer, older, middle],
        slug('ghost'),
      );

      expect(result).toBeNull();
    });

    it('should return null for an empty list', () => {
      expect(BlogPostSequence.neighboursOf([], slug('middle'))).toBeNull();
    });

    it('should be independent of the input order', () => {
      const forward = BlogPostSequence.neighboursOf(
        [older, middle, newer],
        slug('middle'),
      );
      const reversed = BlogPostSequence.neighboursOf(
        [newer, middle, older],
        slug('middle'),
      );

      expect(forward?.newer?.slug.value).toBe(reversed?.newer?.slug.value);
      expect(forward?.older?.slug.value).toBe(reversed?.older?.slug.value);
    });
  });
});
