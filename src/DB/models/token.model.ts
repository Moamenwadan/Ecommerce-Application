import { Document, HydratedDocument, Types } from 'mongoose';

import { MongooseModule, Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Role } from './enums/user.enum';
import { hash } from 'src/common/security/hash.util';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common';
import { userModelName } from './user.model';

// class scehma
@Schema({ timestamps: true })
export class Token extends Document {
  @Prop({ type: String, required: true })
  token: string;
  @Prop({ type: Types.ObjectId, ref: userModelName, required: true })
  user: Types.ObjectId | any;
  @Prop({ type: Date })
  expiredAt: Date;
  @Prop({ type: Boolean, default: true })
  valid: Boolean;
}

// shema
export const TokenSchema = SchemaFactory.createForClass(Token);
TokenSchema.pre('save', async function (next) {
  if (this.isNew) {
    const configService = new ConfigService();
    const jwtService = new JwtService();
    try {
      const payload = jwtService.verify(this.token, {
        secret: configService.get('JWT_SECRET'),
      });
      //   console.log(payload);

      this.expiredAt = new Date(payload.exp * 1000);
      //   console.log(this.expiredAt);
    } catch (error) {
      throw new BadRequestException("the token doesn't exist");
    }
  }
  return next();
});
TokenSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 });

export const TokenModelName = Token.name;
// model
export const TokenModel = MongooseModule.forFeature([
  { name: TokenModelName, schema: TokenSchema },
]);
// Token document
export type TokenDocument = HydratedDocument<Token>;
