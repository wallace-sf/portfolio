export function formatDuration(
  startAt: string,
  locale: string,
  endAt?: string | null,
): string {
  const start = new Date(startAt);
  const end = endAt ? new Date(endAt) : new Date();
  const totalMonths =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  const fmt = (value: number, unit: 'year' | 'month') =>
    new Intl.NumberFormat(locale, {
      style: 'unit',
      unit,
      unitDisplay: 'short',
    }).format(value);

  const parts: string[] = [];
  if (years > 0) parts.push(fmt(years, 'year'));
  if (months > 0) parts.push(fmt(months, 'month'));
  return parts.join(' ') || fmt(1, 'month');
}
