import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserModel } from 'src/DB/models/user.model';
import { UserRepository } from 'src/DB/repositers/user.repository';
import { UserController } from './user.controller';

@Module({
  imports: [UserModel],
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository, UserModel],
  controllers: [UserController],
})
export class UserModule {}
