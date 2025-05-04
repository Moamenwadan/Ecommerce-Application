import { Injectable } from '@nestjs/common';
import { AbstractRepositry } from './abstract.repositry';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Product,
  ProductDocument,
  ProductModelName,
} from '../models/product.model';

@Injectable()
export class ProductRepository extends AbstractRepositry<ProductDocument> {
  constructor(@InjectModel(ProductModelName) Product: Model<ProductDocument>) {
    super(Product);
  }
}
