import { Args, Query, Resolver } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { Graphql } from 'src/common/public/graphql.decorator';
import { AllOrdersResponse } from './entities/order.entity';
import { Roles } from 'src/common/public/roles.decorator';
import { Role } from 'src/DB/models/enums/user.enum';
import { Public } from 'src/common/public/public.decorator';
import { Types } from 'mongoose';
import { User } from 'src/common/public/user-graphql.decorator';
import { paginateInput } from 'src/common/graphql/inputs/paginate.input';

@Resolver()
export class OrderResolver {
  constructor(private readonly _OrderService: OrderService) {}
  @Graphql()
  // @Public()
  @Roles(Role.user)
  @Query(() => AllOrdersResponse)
  async allOrders(
    @User('_id') userId: Types.ObjectId,
    @Args('paginate', { nullable: true }) page?: paginateInput,
  ) {
    return this._OrderService.allOrders(userId, page);
  }
}
