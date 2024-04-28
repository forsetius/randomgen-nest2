export class UnknownTemplateException extends Error {
  public constructor(templateName: string) {
    super();

    this.message = `Template "${templateName}" not found`;
  }
}
