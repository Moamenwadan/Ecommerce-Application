import { ProductModule } from './../product/product.module';
import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { CartModel } from 'src/DB/models/cart.model';
import { CartRepository } from 'src/DB/repositers/cart.repository';
import { ProductRepository } from 'src/DB/repositers/product.repository';
import { ProductModel } from 'src/DB/models/product.model';
import { ProductService } from '../product/product.service';
import { CategoryModule } from '../category/category.module';
import { FileUploadModule } from 'src/common/FileUpload/cloudinary.module';

@Module({
  imports: [
    CartModel,
    ProductModule,
    ProductModel,
    CategoryModule,
    FileUploadModule,
  ],
  controllers: [CartController],
  providers: [CartService, CartRepository, ProductRepository, ProductService],
  exports: [CartRepository, CartService],
})
export class CartModule {}
