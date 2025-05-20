import { Query, Resolver } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { Graphql } from 'src/common/public/graphql.decorator';
import { AllOrdersResponse } from './entities/order.entity';
import { Roles } from 'src/common/public/roles.decorator';
import { Role } from 'src/DB/models/enums/user.enum';
import { Public } from 'src/common/public/public.decorator';

@Resolver()
export class OrderResolver {
  constructor(private readonly _OrderService: OrderService) {}
  @Graphql()
  @Public()
  @Roles(Role.user)
  @Query(() => AllOrdersResponse)
  async allOrders() {
    return this._OrderService.allOrders();
  }
}
