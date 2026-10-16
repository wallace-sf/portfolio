import { BlogPostBuilder } from '@repo/core/testing';
import { describe, expect, it } from 'vitest';

import { toBlogPostSummaryDTO } from '~/blog/use-cases/to-summary-dto';

const words = (count: number) => Array(count).fill('palavra').join(' ');

describe('toBlogPostSummaryDTO', () => {
  it('should derive the reading time from the body in the requested locale', () => {
    const post = BlogPostBuilder.build()
      .withContent({
        'en-US': words(150),
        'pt-BR': words(450),
        es: words(650),
      })
      .now();

    expect(toBlogPostSummaryDTO(post, 'en-US').readingMinutes).toBe(1);
    expect(toBlogPostSummaryDTO(post, 'pt-BR').readingMinutes).toBe(3);
    expect(toBlogPostSummaryDTO(post, 'es').readingMinutes).toBe(4);
  });
});
