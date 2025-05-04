import { OTPDocument } from './../../DB/models/otp.model';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { createUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { compareHash, hash } from 'src/common/security/hash.util';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { sendOTPDto } from './dto/sendotp.dto';
import { OTPRepository } from 'src/DB/repositers/otp.repository';
import * as randomString from 'randomstring';
import { TokenRepository } from 'src/DB/repositers/token.repository';
import { CartRepository } from 'src/DB/repositers/cart.repository';
import { Types } from 'mongoose';
@Injectable()
export class AuthService {
  constructor(
    private readonly _UserService: UserService,
    private readonly _configService: ConfigService,
    private readonly _MailerService: MailerService,
    private readonly _JwtService: JwtService,
    private readonly _OTPRepository: OTPRepository,
    private readonly _TokenRepository: TokenRepository,
    private readonly _CartRepository: CartRepository,
  ) {}

  async sendOTP(data: sendOTPDto) {
    const { email } = data;
    // console.log(data);
    const user = await this._UserService.userExistByEmail(email);

    const otp = await this._OTPRepository.findOne({ filter: { email } });
    if (otp) await otp.deleteOne();
    const newOTP = randomString.generate(6);
    this._MailerService.sendMail({
      from: this._configService.get('EMAIL'),
      to: email,
      subject: 'account active successfully',
      text: 'sucess',
    });
    await this._OTPRepository.create({ email, otp: newOTP });
    return { success: true, message: 'check email', data: newOTP };
  }
  async register(data: createUserDto) {
    const { password, email, otp } = data;

    // console.log(this._configService.get('EMAIL'));
    const otpDoc = await this._OTPRepository.findOne({ filter: { email } });
    if (!otp || !compareHash(otp, otpDoc!.otp))
      throw new NotFoundException('invalid otp');
    await otpDoc?.deleteOne;

    const user = await this._UserService.create({ ...data });
    await this._CartRepository.create({ user: new Types.ObjectId(user.id) });

    return { message: 'done', user };
  }

  async login(data: LoginDto) {
    try {
      const { email, password } = data;
      const user = await this._UserService.validateUser(data);
      const accessToken = this._JwtService.sign(
        { id: user._id },
        {
          secret: this._configService.get('JWT_SECRET'),
          expiresIn: this._configService.get('ACCESS_TOKEN_EXPIRE'),
        },
      );
      await this._TokenRepository.create({
        token: accessToken,
        user: user._id,
      });
      const refreshToken = this._JwtService.sign(
        { id: user._id },
        {
          secret: this._configService.get('JWT_SECRET'),
          expiresIn: this._configService.get('REFRESH_TOKEN_EXPIRE'),
        },
      );
      await this._TokenRepository.create({
        token: refreshToken,
        user: user._id,
      });

      return { success: true, data: { accessToken, refreshToken } };
    } catch (error) {
      throw new BadRequestException('error in login in authService.ts');
    }
  }
}
