export interface IErrorMessagei18n {
  'en-US': Record<string, IErrorMessage>;
  'pt-BR': Record<string, IErrorMessage>;
}

export interface IErrorMessage {
  code: string;
  message: string;
}
