import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const User = createParamDecorator(
  (data: string, context: ExecutionContext) => {
    const gqlctx = GqlExecutionContext.create(context).getContext();
    const { user } = gqlctx.req;
    return data ? user?.[data] : user;
  },
);
