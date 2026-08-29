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

  describe('githubUrl', () => {
    it('should return NEXT_PUBLIC_GITHUB_URL when it is set', () => {
      vi.stubEnv('NEXT_PUBLIC_GITHUB_URL', 'https://github.com/wallace-sf');

      expect(env.githubUrl).toBe('https://github.com/wallace-sf');
    });
  });

  describe('linkedinUrl', () => {
    it('should return NEXT_PUBLIC_LINKEDIN_URL when it is set', () => {
      vi.stubEnv('NEXT_PUBLIC_LINKEDIN_URL', 'https://linkedin.com/in/wallace');

      expect(env.linkedinUrl).toBe('https://linkedin.com/in/wallace');
    });
  });

  describe('resumeUrlByLocale', () => {
    it('should map each locale to its NEXT_PUBLIC_RESUME_URL_* value', () => {
      vi.stubEnv('NEXT_PUBLIC_RESUME_URL_EN_US', 'https://cdn/resume-en.pdf');
      vi.stubEnv('NEXT_PUBLIC_RESUME_URL_PT_BR', 'https://cdn/resume-pt.pdf');
      vi.stubEnv('NEXT_PUBLIC_RESUME_URL_ES', 'https://cdn/resume-es.pdf');

      expect(env.resumeUrlByLocale).toEqual({
        'en-US': 'https://cdn/resume-en.pdf',
        'pt-BR': 'https://cdn/resume-pt.pdf',
        es: 'https://cdn/resume-es.pdf',
      });
    });
  });
});
