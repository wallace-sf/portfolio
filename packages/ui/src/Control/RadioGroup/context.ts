'use client';

import { createContext } from 'react';

import { type IRadioGroupContext } from './types';

export const RadioGroupContext = createContext<IRadioGroupContext>({
  name: '',
  value: '',
  onChange: null,
});

export const RadioGroupProvider = RadioGroupContext.Provider;

RadioGroupContext.displayName = 'RadioGroupContext';
