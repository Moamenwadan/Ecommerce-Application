import { IsEmail, IsString } from 'class-validator';

export class sendOTPDto {
  @IsString()
  @IsEmail()
  email: string;
}
