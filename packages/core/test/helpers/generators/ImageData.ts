import { ILocalizedTextInput } from '~/shared/i18n/LocalizedText';

export class ImageData {
  static url(): string {
    return 'https://example.com/cover.png';
  }

  static alt(): ILocalizedTextInput {
    return {
      'en-US': 'Project cover image',
      'pt-BR': 'Imagem de capa do projeto',
    };
  }

  static altMultiLocale(): ILocalizedTextInput {
    return {
      'pt-BR': 'Imagem de capa do projeto',
      'en-US': 'Project cover image',
      es: 'Imagen de portada del proyecto',
    };
  }
}
