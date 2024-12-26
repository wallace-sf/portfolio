export class ValidationError extends Error {
  constructor(code: string, message?: string) {
    super(message);
    this.name = code;
  }
}
