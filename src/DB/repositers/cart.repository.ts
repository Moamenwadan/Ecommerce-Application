import { Injectable } from '@nestjs/common';
import { AbstractRepositry } from './abstract.repositry';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CartDocument, CartModelName } from '../models/cart.model';

@Injectable()
export class CartRepository extends AbstractRepositry<CartDocument> {
  constructor(@InjectModel(CartModelName) Cart: Model<CartDocument>) {
    super(Cart);
  }
}
