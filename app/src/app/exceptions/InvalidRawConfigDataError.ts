export class InvalidRawConfigDataError extends Error {
  public constructor(
    message: string,
    public override readonly cause?: unknown,
  ) {
    super(message, { cause });

    this.name = 'InvalidRawConfigDataError';
  }
}
