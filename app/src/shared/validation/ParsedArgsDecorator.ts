import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import type { ParsedRequestArgs } from './express-augmentations';

type ParsedRequest = Request & { parsedArgs?: ParsedRequestArgs };

export const ParsedArgs = createParamDecorator<string | undefined>(
  (data, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<ParsedRequest>();
    const parsedArgs = req.parsedArgs;
    if (!parsedArgs) {
      return undefined;
    }

    return data ? parsedArgs[data] : parsedArgs;
  },
);
