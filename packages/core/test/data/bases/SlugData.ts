export class SlugData {
  static valid(): string {
    return 'portfolio-project';
  }

  static validShort(): string {
    return 'abc';
  }

  static validWithNumbers(): string {
    return 'project-2024';
  }

  static tooShort(): string {
    return 'ab';
  }

  static withSpaces(): string {
    return 'my project';
  }

  static withUppercase(): string {
    return 'MyProject';
  }

  static withSpecialChars(): string {
    return 'my_project!';
  }
}
