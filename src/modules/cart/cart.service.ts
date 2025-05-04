import { Cart } from './entities/cart.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Types } from 'mongoose';
import { ProductRepository } from 'src/DB/repositers/product.repository';
import { CartRepository } from 'src/DB/repositers/cart.repository';
import { ProductService } from '../product/product.service';

@Injectable()
export class CartService {
  constructor(
    private readonly _ProductRepository: ProductRepository,
    private readonly _ProductService: ProductService,
    private readonly _CartRepository: CartRepository,
  ) {}
  async addToCart(data: CreateCartDto, userId: Types.ObjectId) {
    const { productId, quantity } = data;
    const product = await this._ProductRepository.findOne({
      filter: {
        _id: productId,
      },
    });

    if (!product) throw new NotFoundException("the product doesn't exist");
    if (!this._ProductService.inStock(product, data.quantity))
      throw new BadRequestException(
        `sorry only ${product.stock} items are available`,
      );
    const isProductCart = await this._CartRepository.findOne({
      filter: {
        user: userId,
        'products.productId': productId,
      },
    });
    // console.log(`isProductCart ${isProductCart}`);
    if (isProductCart) {
      const theProduct = isProductCart.products.find(
        (prd) => prd.productId.toString() == productId.toString(),
      );
      // console.log(`the product ${theProduct}`);
      if (
        this._ProductService.inStock(product, theProduct!.quantity + quantity)
      ) {
        theProduct!.quantity = theProduct!.quantity + quantity;
        await isProductCart.save();
        return { success: true, data: isProductCart };
      } else {
        throw new BadRequestException(
          `sorry only ${product.stock} items are available`,
        );
      }
    }
    const cart = await this._CartRepository.update({
      filter: { user: userId },
      update: {
        $push: { products: { productId, quantity, price: product?.price } },
      },
    });

    return { success: true, data: cart };
  }

  async getCart(userId: Types.ObjectId | string) {
    return this._CartRepository.findOne({
      filter: { user: userId },
    });
  }

  findAll() {
    return `This action returns all cart`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cart`;
  }

  update(id: number, updateCartDto: UpdateCartDto) {
    return `This action updates a #${id} cart`;
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }
}
