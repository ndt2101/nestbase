import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { decode } from 'jsonwebtoken';
import { instanceToPlain } from 'class-transformer';
import { getUserByRequest } from '@guards/guard.helper';

export const User = createParamDecorator(
  async (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return getUserByRequest(data, request);
  },
);
