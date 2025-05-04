import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from '../auth/auth.controller';

import { UserModule } from '../user/user.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { OTPRepository } from 'src/DB/repositers/otp.repository';
import { OTPModel } from 'src/DB/models/otp.model';
import { TokenRepository } from 'src/DB/repositers/token.repository';
import { TokenModel } from 'src/DB/models/token.model';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { AuthGuard } from 'src/common/guards/authentication.guard';
import { UserRepository } from 'src/DB/repositers/user.repository';
import { UserModel } from 'src/DB/models/user.model';
import { AuthorizationGuard } from 'src/common/guards/authorization.guard';
import { CartRepository } from 'src/DB/repositers/cart.repository';
import { CartModule } from '../cart/cart.module';
import { CartModel } from 'src/DB/models/cart.model';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtService,
    OTPRepository,
    TokenRepository,
    UserRepository,
    CartRepository,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthorizationGuard,
    },
  ],
  imports: [UserModule, UserModel, OTPModel, TokenModel, CartModel],
})
export class AuthModule {}
