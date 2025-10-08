import type { Request } from 'express';

export type ParsedRequestArgs = Record<string, unknown>;
export type ParsedRequest = Request & { parsedArgs?: ParsedRequestArgs };

declare module 'express-serve-static-core' {
  interface Request {
    parsedArgs?: ParsedRequestArgs;
  }
}
