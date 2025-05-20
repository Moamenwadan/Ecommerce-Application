import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Types } from 'mongoose';
import { Orderstatus, PaymentMethod } from 'src/DB/models/order.model';

@ObjectType()
export class OneUserResponse {
  @Field(() => String, { nullable: true })
  firstName: string;
  @Field(() => String, { nullable: true })
  lastName: string;
  @Field(() => String, { nullable: true })
  email: string;
}
@ObjectType()
export class OneOrderResponse {
  @Field(() => ID)
  _id: Types.ObjectId;
  @Field(() => OneUserResponse)
  user: OneUserResponse;
  @Field(() => String)
  phone: string;
  @Field(() => String)
  address: string;
  @Field(() => Orderstatus)
  orderStatus: string;
  @Field(() => Number)
  price: number;
  @Field(() => PaymentMethod)
  paymentMethod: PaymentMethod;
  @Field(() => Boolean)
  paid: boolean;
}

@ObjectType()
export class PaginateResponse {
  @Field(() => Number)
  totalNumberOfCategory: number;
  @Field(() => Number)
  totalPages: number;
  @Field(() => Number)
  pageSize: number;
  @Field(() => Number)
  pageNumber: number;
}
@ObjectType()
export class AllOrdersResponse extends PaginateResponse {
  @Field(() => [OneOrderResponse])
  data: OneOrderResponse[];
}
