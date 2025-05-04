import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: string, context: ExecutionContext) => {
    const { user } = context.switchToHttp().getRequest();
    return data ? user?.[data] : user;
  },
);
