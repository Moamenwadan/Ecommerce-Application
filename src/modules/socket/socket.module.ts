import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.getway';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TokenRepository } from 'src/DB/repositers/token.repository';
import { UserModule } from '../user/user.module';
import { TokenModel } from 'src/DB/models/token.model';
import { UserRepository } from 'src/DB/repositers/user.repository';
import { UserModel } from 'src/DB/models/user.model';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [JwtModule, UserModule, TokenModel],
  providers: [
    JwtService,
    UserRepository,
    TokenRepository,
    SocketGateway,
    ConfigService,
  ],
  exports: [SocketGateway, UserRepository, TokenRepository],
})
export class SocketModule {}
