import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { User } from 'src/common/public/param.decorator';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Roles } from 'src/common/public/roles.decorator';
import { Role } from 'src/DB/models/enums/user.enum';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @Roles(Role.user)
  addToCart(
    @Body() data: CreateCartDto,
    @User('_id', ParseObjectIdPipe) userId: Types.ObjectId,
  ) {
    return this.cartService.addToCart(data, userId);
  }
  @Patch('/updateCart')
  @Roles(Role.user)
  updateCart(
    @Body() data: CreateCartDto,
    @User('_id', ParseObjectIdPipe) userId: Types.ObjectId,
  ) {
    return this.cartService.updateCart(data, userId);
  }

  @Patch('/clearCart')
  @Roles(Role.user)
  clearCart(@User('_id', ParseObjectIdPipe) userId: Types.ObjectId) {
    return this.cartService.clearCart(userId);
  }
}
