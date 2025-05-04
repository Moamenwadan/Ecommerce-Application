import { Injectable, UnauthorizedException } from '@nestjs/common';
import { createUserDto } from './dto/create-user.dto';
import { UserRepository } from 'src/DB/repositers/user.repository';
import { LoginDto } from '../auth/dto/login.dto';
import { compareHash } from 'src/common/security/hash.util';

@Injectable()
export class UserService {
  constructor(private readonly _UserRepositry: UserRepository) {}
  async create(data: createUserDto) {
    // console.log(data);
    return this._UserRepositry.create({ ...data });
  }
  async validateUser(data: LoginDto) {
    const { password } = data;
    const user = await this._UserRepositry.findOne({
      filter: { email: data.email },
    });
    if (!user) {
      throw new UnauthorizedException('invalid email');
    } else if (!compareHash(password, user.password)) {
      throw new UnauthorizedException('invalid password');
    }
    return user;
  }
  async userExistByEmail(email: string) {
    console.log(email);
    const user = await this._UserRepositry.findOne({ filter: { email } });
    return user;
  }
}
