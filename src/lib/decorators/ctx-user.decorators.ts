import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CtxUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    console.log(`CTX`, request.user);
    return request.user;
  },
);
