import { pipe } from 'imask';

import { CELLPHONE_MASK } from '../constants';

export const formatCellphone = (value = ''): string | null => {
  try {
    return pipe(value, CELLPHONE_MASK);
  } catch (error) {
    return null;
  }
};
