import { ValidationError } from 'zod-validation-error';

export class SourceFileValidationException extends Error {
  public constructor(source: string, error: ValidationError) {
    super(
      `${source} is not a valid source. Issues found:\n${error.toString()}`,
    );
  }
}
