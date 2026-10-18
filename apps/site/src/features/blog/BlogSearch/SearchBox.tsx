'use client';

import { type ChangeEvent, type KeyboardEvent, useId } from 'react';

import { Icon } from '@repo/ui/Imagery';
import { useTranslations } from 'next-intl';

export interface ISearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  /** The first focus loads the search index. */
  onFocus: () => void;
}

/** The listing's search field: labelled, clearable, `Esc` clears. */
export function SearchBox({ value, onChange, onFocus }: ISearchBoxProps) {
  const t = useTranslations('Blog');
  const inputId = useId();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
    onChange(event.target.value);
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') onChange('');
  };

  return (
    <form
      role="search"
      onSubmit={(event) => event.preventDefault()}
      className="relative flex items-center"
    >
      <label htmlFor={inputId} className="sr-only">
        {t('searchLabel')}
      </label>
      <span className="pointer-events-none absolute left-3 flex text-content-muted">
        <Icon icon="material-symbols:search" className="text-xl" />
      </span>
      <input
        id={inputId}
        type="search"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={onFocus}
        placeholder={t('searchPlaceholder')}
        autoComplete="off"
        className="w-full rounded-card border border-border-default bg-surface px-10 py-2.5 text-content-primary placeholder:text-content-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label={t('searchClear')}
          className="absolute right-2 rounded-full p-1 text-content-secondary hover:text-content-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
        >
          <Icon icon="material-symbols:close" className="text-xl" />
        </button>
      )}
    </form>
  );
}
