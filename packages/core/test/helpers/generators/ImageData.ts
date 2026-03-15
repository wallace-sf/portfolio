import { ILocalizedTextInput } from '../../../src/shared/i18n/LocalizedText';

export class ImageData {
  static url(): string {
    return 'https://example.com/cover.png';
  }

  static alt(): ILocalizedTextInput {
    return { 'pt-BR': 'Imagem de capa do projeto' };
  }

  static altMultiLocale(): ILocalizedTextInput {
    return {
      'pt-BR': 'Imagem de capa do projeto',
      'en-US': 'Project cover image',
      es: 'Imagen de portada del proyecto',
    };
  }
}
