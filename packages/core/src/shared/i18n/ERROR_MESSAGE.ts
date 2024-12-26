import { IErrorMessagei18n } from '@repo/utils';

export const ERROR_MESSAGE: IErrorMessagei18n = {
  'pt-BR': {
    INVALID_DATE_TIME: {
      code: 'INVALID_DATE_TIME',
      message: 'O valor deve ser uma data e hora válida.',
    },
    INVALID_ID: {
      code: 'INVALID_ID',
      message: 'O id deve ser um UUID.',
    },
    INVALID_NAME: {
      code: 'INVALID_NAME',
      message: 'O nome deve ter entre 3 e 100 caracteres.',
    },
  },
  'en-US': {
    INVALID_DATE_TIME: {
      code: 'INVALID_DATE_TIME',
      message: 'The value must be a valid date and time.',
    },
    INVALID_ID: {
      code: 'INVALID_ID',
      message: 'The id must be a valid UUID.',
    },
    INVALID_NAME: {
      code: 'INVALID_NAME',
      message: 'The name must have between 3 and 100 characters.',
    },
  },
};
