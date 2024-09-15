import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    console.log({
      type: ctx.getType(),
      request: ctx.switchToRpc().getData(),
    });
    if (ctx.getType() === 'http') {
      return ctx.switchToHttp().getRequest().user;
    }
    if (['rpc', 'rmq'].includes(ctx.getType())) {
      return ctx.switchToRpc().getData().user;
    }
  },
);
