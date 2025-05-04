import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UserDocument } from 'src/DB/models/user.model';
import { CartService } from '../cart/cart.service';
import { Types } from 'mongoose';
import { ProductRepository } from 'src/DB/repositers/product.repository';
import { ProductService } from '../product/product.service';
import { OrderRepository } from 'src/DB/repositers/order.repository';

@Injectable()
export class OrderService {
  constructor(
    private readonly _CartService: CartService,
    private readonly _ProductRepository: ProductRepository,
    private readonly _ProductService: ProductService,
    private readonly _OrderRepository: OrderRepository,
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
    }
    // user: user._id,
    // price,
    // cart: cart._id || cart.id,
    // user: userId,
    // address:data.address,
    // phone: data.phone,
    const order = await this._OrderRepository.create({
      ...data,
      user: userId,
      cart: cart._id as Types.ObjectId,
      price,
    });

    //3 crate order

    return { succes: true, data: order };
  }

  findAll() {
    return `This action returns all order`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
