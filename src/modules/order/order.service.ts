import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UserDocument } from 'src/DB/models/user.model';
import { CartService } from '../cart/cart.service';
import { Types } from 'mongoose';
import { ProductRepository } from 'src/DB/repositers/product.repository';
import { ProductService } from '../product/product.service';
import { OrderRepository } from 'src/DB/repositers/order.repository';
import { PaymentService } from 'src/common/services/payment/payment.service';
import { Orderstatus, PaymentMethod } from 'src/DB/models/order.model';
import { Query } from '@nestjs/graphql';
import { AllOrdersResponse } from './entities/order.entity';
import { Graphql } from 'src/common/public/graphql.decorator';

@Injectable()
export class OrderService {
  constructor(
    private readonly _CartService: CartService,
    private readonly _ProductRepository: ProductRepository,
    private readonly _ProductService: ProductService,
    private readonly _OrderRepository: OrderRepository,
    private readonly _PaymentService: PaymentService,
  ) {}
  async create(data: CreateOrderDto, user: UserDocument) {
    const userId = user._id as Types.ObjectId;
    // 1 check cart
    const cart = await this._CartService.getCart(userId);
    if (!cart || !cart.products.length)
      throw new BadRequestException('Empty cart');
    // 2 check products
    // 3 check products
    let price = 0;
    let products: any = [];
    for (const prd of cart.products) {
      // check product in database
      const product = await this._ProductRepository.findOne({
        filter: { _id: prd.productId },
      });
      if (!product) throw new BadRequestException("the product doesn't exist");
      // check stock
      if (!this._ProductService.inStock(product, prd.quantity))
        throw new BadRequestException(
          "the quantity that you order it does't exist in stock",
        );
      price = price + prd.quantity * product.finalPrice;
      products.push({
        name: product.name,
        price: product.finalPrice,
        quantity: prd.quantity,
        image: product.thumbnail.secure_url,
      });
    }

    //3 crate order
    const order = await this._OrderRepository.create({
      ...data,
      user: userId,
      cart: cart._id as Types.ObjectId,
      price,
    });

    // 4 if payment method cash
    if (order.paymentMethod == 'cash') {
      for (const prd of cart.products) {
        // update stock
        await this._ProductService.updateStock(
          prd.productId,
          prd.quantity,
          false,
        );
      }
    }

    const session = await this.payWithCard(order.id, products, user.email);

    return { succes: true, data: order, session };
  }

  async payWithCard(orderId, products, userEmail) {
    const line_items = products.map((product) => ({
      price_data: {
        currency: 'egp', // أو 'usd' أو أي عملة مدعومة

        product_data: {
          name: product.name,
          images: [product.image],
        },
        unit_amount: product.price * 100,
      },
      quantity: product.quantity,
    }));
    const { id } = await this._PaymentService.createCopoun({
      currency: 'egp',
      percent_off: 20,
    });
    return this._PaymentService.createCheckoutSession({
      line_items: line_items,
      metadata: { orderId: orderId },
      customer_email: userEmail,
      discounts: [
        {
          coupon: id,
        },
      ],
    });
  }
  async stripeWebHook(info) {
    const { orderId } = info.data.object.metadata;
    const order = await this._OrderRepository.update({
      filter: { _id: new Types.ObjectId(orderId) },
      update: {
        paid: true,
        payment_intent: info.data.object.payment_intent,
      },
    });
    await this._CartService.clearCart(order!.user);
  }

  async cancelOrder(orderId: Types.ObjectId, userId: Types.ObjectId) {
    const order = await this._OrderRepository.findOne({
      filter: { _id: orderId, user: userId },
    });
    if (!order) throw new BadRequestException('Invalid order');

    if (order.paymentMethod == PaymentMethod.card) {
      await this._PaymentService.refund(order.payment_intent);
      order.orderStatus = Orderstatus.refounded;
    }
    order.orderStatus = Orderstatus.canceled;
    await order.save();

    return { message: 'done' };
  }

  allOrders() {
    return this._OrderRepository.findAll({
      populate: 'user',
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
