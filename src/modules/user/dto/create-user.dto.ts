import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  isString,
  IsString,
  ValidateIf,
} from 'class-validator';
import { AuthService } from 'src/modules/auth/auth.service';

export class createUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;
  @IsString()
  @IsNotEmpty()
  password: string;
  @IsString()
  // @IsNotEmpty()
  @IsIn([Math.random], { message: 'password must match' })
  @ValidateIf((obj) => obj.password !== obj.confirmPassword)
  confirmPassword: string;
  @IsString()
  otp: string;
}
