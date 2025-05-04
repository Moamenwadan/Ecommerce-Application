import { Document, HydratedDocument, Types } from 'mongoose';
import { MongooseModule, Prop, SchemaFactory, Schema } from '@nestjs/mongoose';

import { userModelName } from './user.model';
import { CartModelName } from './cart.model';
import { Image } from 'src/common/types/image.type';
export enum Orderstatus {
  placed = 'placed',
  shipped = 'shipped',
  onWay = 'onWay',
  delivered = 'delivered',
  canceled = 'canceled',
  refounded = 'refounded',
}
export enum PaymentMethod {
  card = 'card',
  cash = 'cash',
}

// class schema
@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ type: Types.ObjectId, ref: userModelName, required: true })
  user: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: CartModelName, required: true })
  cart: Types.ObjectId;
  @Prop({ type: String, required: true })
  phone: string;
  @Prop({ type: String, required: true })
  address: string;

  @Prop({ type: String, default: Orderstatus.placed })
  orderStatus: Orderstatus;
  @Prop({ type: Number, required: true })
  price: Number;
  @Prop({ type: String, default: PaymentMethod.cash })
  paymentMethod: PaymentMethod;
  @Prop({ type: { secure_url: String, public_id: String } })
  invoice: Image;
  @Prop({ type: Boolean, default: false })
  paid: boolean;
  @Prop({ type: String })
  payment_intent: string;
}

// schema
export const OrderSchema = SchemaFactory.createForClass(Order);

// model name
export const OrderModelName = Order.name;

export const OrderModel = MongooseModule.forFeature([
  { name: OrderModelName, schema: OrderSchema },
]);

// document type
export type OrderDocument = HydratedDocument<Order>;
