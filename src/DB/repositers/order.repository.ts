import { Injectable } from '@nestjs/common';
import { AbstractRepositry } from './abstract.repositry';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrderDocument, OrderModelName } from '../models/order.model';

@Injectable()
export class OrderRepository extends AbstractRepositry<OrderDocument> {
  constructor(@InjectModel(OrderModelName) Order: Model<OrderDocument>) {
    super(Order);
  }
}
