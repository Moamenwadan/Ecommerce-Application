import { Injectable } from '@nestjs/common';
import { AbstractRepositry } from './abstract.repositry';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TokenDocument, TokenModelName } from '../models/token.model';

@Injectable()
export class TokenRepository extends AbstractRepositry<TokenDocument> {
  constructor(@InjectModel(TokenModelName) Token: Model<TokenDocument>) {
    super(Token);
  }
}
