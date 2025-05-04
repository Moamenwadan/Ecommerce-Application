import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { createUserDto } from '../user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { sendOTPDto } from './dto/sendotp.dto';
import { Public } from 'src/common/public/public.decorator';

@Controller('auth')
@Public()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Body() data: createUserDto) {
    // console.log(data);
    return this.authService.register(data);
  }

  @Post('login')
  async login(@Body() data: LoginDto) {
    return this.authService.login(data);
  }
  @Post('send-otp')
  async sendOTP(@Body() data: sendOTPDto) {
    console.log(`data`);
    console.log(`data:${data}`);
    return this.authService.sendOTP(data);
  }
}
