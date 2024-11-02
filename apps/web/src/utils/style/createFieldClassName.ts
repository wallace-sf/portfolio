import classNames from 'classnames';

import { IFieldProps } from '~types';

type CreateFieldClassNameParams = IFieldProps & {
  className?: string;
};

export const createFieldClassName = ({
  error,
  errorBorder,
  touched,
  unstyled,
  className,
}: CreateFieldClassNameParams) => {
  return classNames(
    {
      '!border-error': error && errorBorder && touched && !unstyled,
      '!border-accent': error == null && errorBorder && touched && !unstyled,
      'border-2 border-dark-500 bg-dark-300 h-12 rounded-xl p-3 w-full text-sm font-medium outline-none placeholder:font-normal focus:!border-primary active:!border-primary placeholder:text-dark-500 disabled:bg-whiter disabled:cursor-default dark:text-white':
        !unstyled,
    },
    className,
  );
};
