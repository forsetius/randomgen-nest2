export class LanguageNotSupportedException extends Error {
  public constructor(language: string) {
    super();

    this.message = `No templates for language "${language}"`;
  }
}
