import { ValidationError } from 'class-validator';

export class InvalidEnvVarsException extends Error {
  public constructor(errors: ValidationError[]) {
    super();

    this.message = errors.toString();
  }
}
