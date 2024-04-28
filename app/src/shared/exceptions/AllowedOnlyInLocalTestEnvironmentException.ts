export class AllowedOnlyInLocalTestEnvironmentException extends Error {
  public constructor(message: string) {
    super();

    this.message = `${message} is allowed only in LOCAL or TEST environment`;
  }
}
