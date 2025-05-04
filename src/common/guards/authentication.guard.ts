import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { TokenRepository } from 'src/DB/repositers/token.repository';
import { UserRepository } from 'src/DB/repositers/user.repository';
import { Is_PUBLIC_KEY } from '../public/public.decorator';
import { Request } from 'express';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private _JwtService: JwtService,
    private _ConfigService: ConfigService,
    private _UserRepository: UserRepository,
    private _TokenRepository: TokenRepository,
    private _reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this._reflector.getAllAndOverride(Is_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    // console.log(isPublic);
    if (isPublic) return true;
    const request = context.switchToHttp().getRequest();
    // console.log(request);
    const token = this.extractTokenFromHeader(request);
    // console.log(token);
    if (!token) throw new UnauthorizedException();

    try {
      const payload = await this._JwtService.verify(token!, {
        secret: this._ConfigService.get('JWT_SECRET'),
      });
      // console.log(payload);
      const user = await this._UserRepository.findOne({
        filter: { _id: payload.id },
      });
      // console.log(user);

      if (!user) throw new NotFoundException("the user doen't exist");

      const tokenDoc = await this._TokenRepository.findOne({
        filter: { token, valid: true, user: user?._id },
      });
      // console.log(tokenDoc);
      if (!tokenDoc) throw new NotFoundException("the user doen't exit");
      request.user = user;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('from authentication guard');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type == 'Bearer' ? token : undefined;
  }
}
