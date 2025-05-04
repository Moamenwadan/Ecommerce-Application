import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';
import { hash } from 'src/common/security/hash.util';
@Schema({ timestamps: true })
export class OTP {
  @Prop({ type: String, required: true, unique: true })
  email: string;
  @Prop({ type: String, required: true })
  otp: string;
}

export const OTPSchema = SchemaFactory.createForClass(OTP);

OTPSchema.index({ CreatedAt: 1 }, { expireAfterSeconds: 300 });
OTPSchema.pre('save', async function (next) {
  console.log(this);
  console.log(this.otp);
  if (this.isModified('otp')) {
    this.otp = await hash(this.otp);
  }
  return next();
});
export const OTPModelName = OTP.name;

export const OTPModel = MongooseModule.forFeature([
  { name: OTPModelName, schema: OTPSchema },
]);

export type OTPDocument = HydratedDocument<OTP>;
