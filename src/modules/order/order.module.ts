import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { CartModule } from '../cart/cart.module';
import { CartService } from '../cart/cart.service';
import { ProductModule } from '../product/product.module';
import { OrderModel } from 'src/DB/models/order.model';
import { OrderRepository } from 'src/DB/repositers/order.repository';

@Module({
  imports: [OrderModel, CartModule, ProductModule],
  controllers: [OrderController],
  providers: [OrderService, CartService, OrderRepository],
})
export class OrderModule {}
