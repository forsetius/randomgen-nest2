import { z, type ZodError } from 'zod';

export class InvalidEnvVarsException extends Error {
  public constructor(error: ZodError) {
    super();

    this.message = z.prettifyError(error);
  }
}
