import { Document, HydratedDocument } from 'mongoose';

import { MongooseModule, Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Role } from './enums/user.enum';
import { hash } from 'src/common/security/hash.util';

// class scehma
@Schema()
export class User extends Document {
  @Prop({ type: String, required: true })
  firstName: string;
  @Prop({ type: String, required: true })
  lastName: string;
  @Prop({ type: String, required: true, lowercase: true, unique: true })
  email: string;
  @Prop({ type: String, required: true })
  password: string;
  @Prop({ type: Boolean, default: true })
  accountActivated: boolean;
  @Prop({ type: String, default: Role.user })
  role: Role;
  @Prop({ type: String, required: true })
  otp: string;
}

// shema
export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.pre('save', async function (next) {
  // console.log(this);
  // console.log(this.password);
  if (this.isModified('password')) {
    this.password = await hash(this.password);
  }
  return next();
});
export const userModelName = User.name;
// model
export const UserModel = MongooseModule.forFeature([
  { name: userModelName, schema: UserSchema },
]);
// user document
export type UserDocument = HydratedDocument<User>;
