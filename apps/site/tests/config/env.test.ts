import { afterEach, describe, expect, it, vi } from 'vitest';

import { env } from '../../src/config/env';

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

      expect(env.siteUrl).toBe('http://localhost:3000');
    });
  });

  describe('contactEmail', () => {
    it('should return NEXT_PUBLIC_CONTACT_EMAIL when it is set', () => {
      vi.stubEnv('NEXT_PUBLIC_CONTACT_EMAIL', 'wallace@example.com');

      expect(env.contactEmail).toBe('wallace@example.com');
    });

    it('should return undefined when NEXT_PUBLIC_CONTACT_EMAIL is unset', () => {
      vi.stubEnv('NEXT_PUBLIC_CONTACT_EMAIL', undefined);

      expect(env.contactEmail).toBeUndefined();
    });
  });

  describe('contactNumber', () => {
    it('should return NEXT_PUBLIC_CONTACT_NUMBER when it is set', () => {
      vi.stubEnv('NEXT_PUBLIC_CONTACT_NUMBER', '5511913462107');

      expect(env.contactNumber).toBe('5511913462107');
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
      vi.stubEnv(
        'NEXT_PUBLIC_LINKEDIN_URL',
        'https://www.linkedin.com/in/wallace-silva-ferreira/',
      );

      expect(env.linkedinUrl).toBe(
        'https://www.linkedin.com/in/wallace-silva-ferreira/',
      );
    });
  });

  describe('whatsappUrl', () => {
    it('should return NEXT_PUBLIC_WHATSAPP_URL when it is set', () => {
      vi.stubEnv(
        'NEXT_PUBLIC_WHATSAPP_URL',
        'https://api.whatsapp.com/send?phone=5511913462107',
      );

      expect(env.whatsappUrl).toBe(
        'https://api.whatsapp.com/send?phone=5511913462107',
      );
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

  describe('resumeUrlByLocale', () => {
    it('should map each supported locale to its resume URL env var', () => {
      vi.stubEnv(
        'NEXT_PUBLIC_RESUME_URL_EN_US',
        'https://example.com/resume-en.pdf',
      );
      vi.stubEnv(
        'NEXT_PUBLIC_RESUME_URL_PT_BR',
        'https://example.com/resume-pt.pdf',
      );
      vi.stubEnv(
        'NEXT_PUBLIC_RESUME_URL_ES',
        'https://example.com/resume-es.pdf',
      );

      expect(env.resumeUrlByLocale).toEqual({
        'en-US': 'https://example.com/resume-en.pdf',
        'pt-BR': 'https://example.com/resume-pt.pdf',
        es: 'https://example.com/resume-es.pdf',
      });
    });
  });
});
