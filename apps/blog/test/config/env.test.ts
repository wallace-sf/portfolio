import { afterEach, describe, expect, it, vi } from 'vitest';

import { env } from '~/config/env';

describe('env', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe('siteUrl', () => {
    it('should return NEXT_PUBLIC_SITE_URL when it is set', () => {
      vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://wallace-ferreira.dev');

      expect(env.siteUrl).toBe('https://wallace-ferreira.dev');
    });

    it('should fall back to localhost when NEXT_PUBLIC_SITE_URL is unset', () => {
      vi.stubEnv('NEXT_PUBLIC_SITE_URL', undefined);

      expect(env.siteUrl).toBe('http://localhost:3002');
    });
  });

  describe('gaMeasurementId', () => {
    it('should return NEXT_PUBLIC_GA_MEASUREMENT_ID when it is set', () => {
      vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-X7JEY0B6MZ');

      expect(env.gaMeasurementId).toBe('G-X7JEY0B6MZ');
    });

    it('should return undefined when NEXT_PUBLIC_GA_MEASUREMENT_ID is unset', () => {
      vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', undefined);

      expect(env.gaMeasurementId).toBeUndefined();
    });
  });
});
