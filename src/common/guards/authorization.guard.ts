import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Is_PUBLIC_KEY } from '../public/public.decorator';
import { Request } from 'express';
import { ROLES_KEY } from '../public/roles.decorator';
import { Is_GRAPHQL } from '../public/graphql.decorator';
import { GqlExecutionContext } from '@nestjs/graphql';
@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private _reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this._reflector.getAllAndOverride(Is_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    let request;
    const isGraphql = this._reflector.getAllAndOverride(Is_GRAPHQL, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isGraphql) {
      const ctx = GqlExecutionContext.create(context).getContext();
      request = ctx.req;
    } else {
      request = context.switchToHttp().getRequest();
    }
    try {
      const { user } = request;
      const requiredRoles = this._reflector.getAllAndOverride(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
      console.log(requiredRoles);

      return requiredRoles.includes(user?.role);
    } catch (error) {
      throw new UnauthorizedException(
        "the role doesn't accessable to this endpoint (because authorization guard) ",
      );
    }
  }
  private extractTokenFromHeader(request: Request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type == 'Bearer' ? token : undefined;
  }
}
