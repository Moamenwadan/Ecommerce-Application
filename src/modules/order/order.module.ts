import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { CartModule } from '../cart/cart.module';
import { CartService } from '../cart/cart.service';
import { ProductModule } from '../product/product.module';
import { OrderModel } from 'src/DB/models/order.model';
import { OrderRepository } from 'src/DB/repositers/order.repository';
import { PaymentService } from 'src/common/services/payment/payment.service';
import { PaymentModule } from 'src/common/services/payment/payment.module';
// import { OrderResolver } from './order.resolver';
import { OrderResolver } from './order.resolver';

@Module({
  imports: [OrderModel, CartModule, ProductModule, PaymentModule],
  controllers: [OrderController],
  providers: [
    OrderService,
    CartService,
    OrderRepository,
    PaymentService,
    OrderResolver,
  ],
})
export class OrderModule {}
