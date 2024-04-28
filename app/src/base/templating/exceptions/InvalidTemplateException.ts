export class InvalidTemplateException extends Error {
  public constructor() {
    super();

    this.message = 'Invalid template';
  }
}
