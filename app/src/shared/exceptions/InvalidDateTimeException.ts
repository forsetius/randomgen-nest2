export class InvalidDateTimeException extends Error {
  public constructor(message: string, e: unknown) {
    super();

    this.message =
      e instanceof Error ? `${message}.\n Reason: ${e.message}` : message;
  }
}
