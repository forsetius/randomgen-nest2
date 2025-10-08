import { z } from 'zod';
import type { ZodError } from 'zod';

export class SourceFileValidationException extends Error {
  public constructor(source: string, error: ZodError) {
    super(
      `${source} is not a valid source. Issues found:\n${z.prettifyError(error)}`,
    );
  }
}
