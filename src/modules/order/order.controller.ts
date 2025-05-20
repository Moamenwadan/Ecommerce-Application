import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UserDocument } from 'src/DB/models/user.model';
import { User } from 'src/common/public/param.decorator';
import { Roles } from 'src/common/public/roles.decorator';
import { Role } from 'src/DB/models/enums/user.enum';
import { Public } from 'src/common/public/public.decorator';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('')
  @Roles(Role.user)
  create(@Body() data: CreateOrderDto, @User() user: UserDocument) {
    return this.orderService.create(data, user);
  }

  @Post('/webhook')
  @Public()
  async stripeWebHook(@Body() data: any) {
    console.log({ dataFromstripe: data });
    return this.orderService.stripeWebHook(data);
  }
  // @Get()
  // findAll() {
  //   return this.orderService.findAll();
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }

  @Roles(Role.user)
  @Post('cancel/:id')
  cancelOrder(
    @Param('id', ParseObjectIdPipe) orderId: Types.ObjectId,
    @User('_id') userId: Types.ObjectId,
  ) {
    return this.orderService.cancelOrder(orderId, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
