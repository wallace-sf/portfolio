import { renderHook } from '@testing-library/react';

import { useNavLink } from '~/hooks/useNavLink';

const mocks = vi.hoisted(() => ({ pathname: '/en-US/projects' }));

vi.mock('next-intl', () => ({
  useLocale: () => 'en-US',
}));

vi.mock('next/navigation', () => ({
  usePathname: () => mocks.pathname,
}));

describe('useNavLink', () => {
  it('should prefix the path with the active locale', () => {
    mocks.pathname = '/en-US';
    const { result } = renderHook(() => useNavLink('/projects'));

    expect(result.current.href).toBe('/en-US/projects');
  });

  it('should resolve the root path to the bare locale segment', () => {
    mocks.pathname = '/en-US';
    const { result } = renderHook(() => useNavLink('/'));

    expect(result.current.href).toBe('/en-US');
  });

  it('should mark the root link active only on an exact pathname match', () => {
    mocks.pathname = '/en-US/projects';
    expect(renderHook(() => useNavLink('/')).result.current.active).toBe(false);

    mocks.pathname = '/en-US';
    expect(renderHook(() => useNavLink('/')).result.current.active).toBe(true);
  });

  it('should mark a non-root link active on an exact or prefix match', () => {
    mocks.pathname = '/en-US/projects';
    expect(
      renderHook(() => useNavLink('/projects')).result.current.active,
    ).toBe(true);

    mocks.pathname = '/en-US/projects/my-app';
    expect(
      renderHook(() => useNavLink('/projects')).result.current.active,
    ).toBe(true);
  });

  it('should not mark a link active when only its name is a prefix of the pathname', () => {
    mocks.pathname = '/en-US/projects-archive';
    expect(
      renderHook(() => useNavLink('/projects')).result.current.active,
    ).toBe(false);
  });
});
