import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as usehooksTs from 'usehooks-ts';

import { useTheme } from '../../src/hooks/useTheme';

vi.mock('usehooks-ts', () => ({
  useLocalStorage: vi.fn(),
  useIsClient: vi.fn(),
  useDarkMode: vi.fn(),
}));

const mockDarkMode = {
  isDarkMode: false,
  enable: vi.fn(),
  disable: vi.fn(),
  toggle: vi.fn(),
  set: vi.fn(),
};

describe('useTheme', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('dark', 'light');
    vi.mocked(usehooksTs.useIsClient).mockReturnValue(true);
    vi.mocked(usehooksTs.useDarkMode).mockReturnValue({
      ...mockDarkMode,
      isDarkMode: false,
    });
  });

  it('should apply dark class and remove light class when theme is dark', () => {
    vi.mocked(usehooksTs.useLocalStorage).mockReturnValue(['dark', vi.fn(), vi.fn()]);

    renderHook(() => useTheme());

    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.classList.contains('light')).toBe(false);
  });

  it('should apply light class and remove dark class when theme is light', () => {
    vi.mocked(usehooksTs.useLocalStorage).mockReturnValue(['light', vi.fn(), vi.fn()]);

    renderHook(() => useTheme());

    expect(document.documentElement.classList.contains('light')).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('should apply dark class when theme is system and system prefers dark mode', () => {
    vi.mocked(usehooksTs.useLocalStorage).mockReturnValue(['system', vi.fn(), vi.fn()]);
    vi.mocked(usehooksTs.useDarkMode).mockReturnValue({
      ...mockDarkMode,
      isDarkMode: true,
    });

    renderHook(() => useTheme());

    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.classList.contains('light')).toBe(false);
  });

  it('should apply light class when theme is system and system prefers light mode', () => {
    vi.mocked(usehooksTs.useLocalStorage).mockReturnValue(['system', vi.fn(), vi.fn()]);
    vi.mocked(usehooksTs.useDarkMode).mockReturnValue({
      ...mockDarkMode,
      isDarkMode: false,
    });

    renderHook(() => useTheme());

    expect(document.documentElement.classList.contains('light')).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('should not modify classes when not yet client-side hydrated', () => {
    vi.mocked(usehooksTs.useIsClient).mockReturnValue(false);
    vi.mocked(usehooksTs.useLocalStorage).mockReturnValue(['dark', vi.fn(), vi.fn()]);

    renderHook(() => useTheme());

    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(document.documentElement.classList.contains('light')).toBe(false);
  });
});
