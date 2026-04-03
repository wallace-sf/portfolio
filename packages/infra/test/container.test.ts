import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

vi.mock('../src/prisma/client', () => ({
  prisma: {},
}));

vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(() => ({ emails: { send: vi.fn() } })),
}));

vi.mock('../src/repositories/project/PrismaProjectRepository', () => ({
  PrismaProjectRepository: vi.fn().mockImplementation(() => ({ findAll: vi.fn() })),
}));

vi.mock('../src/repositories/experience/PrismaExperienceRepository', () => ({
  PrismaExperienceRepository: vi.fn().mockImplementation(() => ({ findAll: vi.fn() })),
}));

vi.mock('../src/repositories/profile/PrismaProfileRepository', () => ({
  PrismaProfileRepository: vi.fn().mockImplementation(() => ({ find: vi.fn() })),
}));

vi.mock('../src/services/ResendEmailService', () => ({
  ResendEmailService: vi.fn().mockImplementation(() => ({ send: vi.fn() })),
}));

const VALID_ENV = {
  RESEND_API_KEY: 're_test_key',
  CONTACT_EMAIL_TO: 'owner@example.com',
  CONTACT_EMAIL_FROM: 'onboarding@resend.dev',
};

describe('container', () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    originalEnv = { ...process.env };
    Object.assign(process.env, VALID_ENV);
    vi.resetModules();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('makeContainer', () => {
    it('should return a container with all dependencies', async () => {
      const { makeContainer } = await import('../src/container');

      const container = makeContainer();

      expect(container.projectRepository).toBeDefined();
      expect(container.experienceRepository).toBeDefined();
      expect(container.profileRepository).toBeDefined();
      expect(container.emailService).toBeDefined();
    });

    it('should throw when RESEND_API_KEY is missing', async () => {
      delete process.env['RESEND_API_KEY'];
      const { makeContainer } = await import('../src/container');

      expect(() => makeContainer()).toThrow('RESEND_API_KEY');
    });

    it('should throw when CONTACT_EMAIL_TO is missing', async () => {
      delete process.env['CONTACT_EMAIL_TO'];
      const { makeContainer } = await import('../src/container');

      expect(() => makeContainer()).toThrow('CONTACT_EMAIL_TO');
    });

    it('should throw when CONTACT_EMAIL_FROM is missing', async () => {
      delete process.env['CONTACT_EMAIL_FROM'];
      const { makeContainer } = await import('../src/container');

      expect(() => makeContainer()).toThrow('CONTACT_EMAIL_FROM');
    });

    it('should list all missing variables in a single error', async () => {
      delete process.env['RESEND_API_KEY'];
      delete process.env['CONTACT_EMAIL_TO'];
      delete process.env['CONTACT_EMAIL_FROM'];
      const { makeContainer } = await import('../src/container');

      expect(() => makeContainer()).toThrow(
        /RESEND_API_KEY.*CONTACT_EMAIL_TO.*CONTACT_EMAIL_FROM/,
      );
    });
  });

  describe('getContainer', () => {
    it('should return the same instance on subsequent calls', async () => {
      const { getContainer } = await import('../src/container');

      const first = getContainer();
      const second = getContainer();

      expect(first).toBe(second);
    });
  });
});
