import { formatCellphone } from '../../src';

describe('formatCellphone', () => {
  it('should format cellphone', () => {
    expect(formatCellphone('11999999999')).toBe('+55 11 99999-9999');
    expect(formatCellphone('')).toBe('');
    expect(formatCellphone('Lorem')).toBe('+55 ');
    expect(formatCellphone(undefined as unknown as string)).toBe('');
  });

  it('should not format cellphone', () => {
    expect(formatCellphone(0 as unknown as string)).toBeNull();
  });
});
