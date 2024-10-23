import { faker } from '@faker-js/faker';

export class TextData {
  static text(): string {
    return faker.lorem.text();
  }

  static title(): string {
    return faker.lorem.words(3).slice(0, 60);
  }

  static caption(): string {
    return faker.lorem.sentences().slice(0, 200);
  }

  static description(): string {
    return faker.lorem.sentences().slice(0, 50);
  }
  static language(): string {
    return [
      'English',
      'Português do Brasil',
      'Espanõl',
      'Français',
      'Italiano',
    ][faker.number.int({ min: 0, max: 4 })] as string;
  }

  static socialNetwork(): string {
    return [
      'Facebook',
      'Twitter',
      'Instagram',
      'LinkedIn',
      'GitHub',
      'Google',
      'YouTube',
      'Bluesky',
      'Flickr',
    ][faker.number.int({ min: 0, max: 8 })] as string;
  }

  static locale(): string {
    return ['pt-BR', 'en-US', 'es-ES', 'fr-FR', 'it-IT'][
      faker.number.int({ min: 0, max: 4 })
    ] as string;
  }

  static icon(): string {
    return [
      'house',
      'envelope',
      'user',
      'phone',
      'map',
      'lock',
      'key',
      'image',
      'camera',
      'file',
      'file-text',
      'file-alt',
    ][faker.number.int({ min: 0, max: 11 })] as string;
  }
}
