import { ZodError } from 'zod';

export class SourceFileValidationException extends Error {
  public constructor(filename: string, error: ZodError) {
    super(
      `${filename} is not a valid source file. Issues found:\n${error.toString()}`,
    );
  }
}
