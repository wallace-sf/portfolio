import { simulateLoading, simulateError } from '~/dev/simulate';

describe('simulateLoading', () => {
  it('should resolve without delay outside development', async () => {
    const start = Date.now();
    await simulateLoading(2000);
    expect(Date.now() - start).toBeLessThan(100);
  });
});

describe('simulateError', () => {
  it('should throw an Error outside development', () => {
    expect(() => simulateError()).toThrow(Error);
  });
});
