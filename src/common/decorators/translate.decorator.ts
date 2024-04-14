import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface Translator {
  (phrase: string): string;
}

export const Trans = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.__;
  },
);
