import { Injectable } from '@nestjs/common';
import { AbstractRepositry } from './abstract.repositry';
import { UserDocument, userModelName } from '../models/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserRepository extends AbstractRepositry<UserDocument> {
  constructor(@InjectModel(userModelName) User: Model<UserDocument>) {
    super(User);
  }
}
