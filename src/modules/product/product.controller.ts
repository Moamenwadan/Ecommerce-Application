import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  UploadedFile,
  Query,
  ParseBoolPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Roles } from 'src/common/public/roles.decorator';
import { Role } from 'src/DB/models/enums/user.enum';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { User } from 'src/common/public/param.decorator';
import { Types } from 'mongoose';
import { thumbnailRequiredPipe } from './pipe/required-thumbnailpipe';
import { IsObjectIdPipe, ParseObjectIdPipe } from '@nestjs/mongoose';
import { RemoveImageDto } from './dto/remove-image.dto';
import { FindProductsDto } from './dto/find-product.dto';
import { Public } from 'src/common/public/public.decorator';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Roles(Role.seller)
  @Post(':categoryId')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'thumbnail', maxCount: 1 },
      { name: 'images', maxCount: 3 },
    ]),
  )
  async create(
    @Body() data: CreateProductDto,
    @User('_id') userId: Types.ObjectId,
    @Param('categoryId', ParseObjectIdPipe) categoryId: Types.ObjectId,
    @UploadedFiles(thumbnailRequiredPipe)
    files: Record<string, Express.Multer.File[]>,
  ) {
    return this.productService.create(data, userId, categoryId, files);
  }
  @Roles(Role.seller)
  @Patch(':productId')
  async update(
    @Param('productId', ParseObjectIdPipe) productId: Types.ObjectId,
    @User('_id') userId: Types.ObjectId,
    @Body() data: UpdateProductDto,
  ) {
    return this.productService.update(data, productId, userId);
  }
  @Roles(Role.seller)
  @Patch(':productId/remove-image')
  async removeImage(
    @Param('productId', ParseObjectIdPipe) productId: Types.ObjectId,
    @User('_id') userId: Types.ObjectId,
    @Body() data: RemoveImageDto,
  ) {
    return this.productService.removeImage(data.secure_url, productId, userId);
  }
  @Roles(Role.seller)
  @UseInterceptors(FileInterceptor('image'))
  @Patch(':productId/add-image')
  async addImage(
    @Param('productId', ParseObjectIdPipe) productId: Types.ObjectId,
    @User('_id') userId: Types.ObjectId,
    // @Body() data: RemoveImageDto,
    @UploadedFile() image: Express.Multer.File,
    @Query('isThumbnail', ParseBoolPipe) isThumbnail: boolean,
  ) {
    return this.productService.addImage(
      // data.secure_url,
      productId,
      userId,
      isThumbnail,
      image,
    );
  }
  @Roles(Role.seller, Role.admin)
  @Delete(':productId')
  remove(
    @Param('productId', ParseObjectIdPipe) productId: Types.ObjectId,
    @User('_id', ParseObjectIdPipe) userId: Types.ObjectId,
  ) {
    return this.productService.remove(productId, userId);
  }
  @Public()
  @Roles(Role.seller, Role.admin, Role.user)
  @Get()
  findAll(@Query() query: FindProductsDto) {
    return this.productService.findAll(query);
  }
  @Public()
  @Get('/redis/cache')
  async testRedis() {
    return this.productService.testRedis();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }
}
