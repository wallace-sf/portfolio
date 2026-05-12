import { simulateLoading, simulateError, applyDevSimulations } from '~/dev/simulate';
import { isDev } from '~/dev/isDev';

describe('isDev', () => {
  it('should return false outside development', () => {
    expect(isDev()).toBe(false);
  });
});

describe('simulateLoading', () => {
  it('should resolve without delay outside development', async () => {
    const start = Date.now();
    await simulateLoading(2000);
    expect(Date.now() - start).toBeLessThan(100);
  });
});

describe('simulateError', () => {
  it('should not throw outside development', () => {
    expect(() => simulateError()).not.toThrow();
  });
});

describe('applyDevSimulations', () => {
  it('should resolve immediately when called with no params', async () => {
    await expect(applyDevSimulations()).resolves.toBeUndefined();
  });

  it('should resolve without delay when loading param is present outside development', async () => {
    const start = Date.now();
    await applyDevSimulations({ loading: '2000' });
    expect(Date.now() - start).toBeLessThan(100);
  });

  it('should not throw when error param is present outside development', async () => {
    await expect(applyDevSimulations({ error: '1' })).resolves.toBeUndefined();
  });
});
