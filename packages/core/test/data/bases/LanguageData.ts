import { faker } from '@faker-js/faker';

export class LanguageData {
  static valid(): string {
    return [
      'English',
      'Português do Brasil',
      'Espanõl',
      'Français',
      'Italiano',
    ][faker.number.int({ min: 0, max: 4 })] as string;
  }
}
