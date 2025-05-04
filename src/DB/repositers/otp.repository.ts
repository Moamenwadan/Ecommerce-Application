import { OTPDocument, OTPModelName } from './../models/otp.model';
import { Injectable } from '@nestjs/common';
import { AbstractRepositry } from './abstract.repositry';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class OTPRepository extends AbstractRepositry<OTPDocument> {
  constructor(@InjectModel(OTPModelName) OTP: Model<OTPDocument>) {
    super(OTP);
  }
}
