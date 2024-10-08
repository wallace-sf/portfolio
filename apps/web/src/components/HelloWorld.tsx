'use client';

import { FC } from 'react';

import { useDarkMode } from 'usehooks-ts';

export const HelloWorld: FC = () => {
  const { isDarkMode } = useDarkMode();

  // eslint-disable-next-line no-console
  console.log('isDarkMode', isDarkMode);

  return <h1>Hello World</h1>;
};
