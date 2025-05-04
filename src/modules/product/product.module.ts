import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductModel } from 'src/DB/models/product.model';
import { CategoryModule } from '../category/category.module';
import { CategoryRepository } from 'src/DB/repositers/category.repository';
import { CategoryService } from '../category/category.service';
import { ProductRepository } from 'src/DB/repositers/product.repository';
import { CategoryModel } from 'src/DB/models/category.model';
import { FileUploadService } from 'src/common/FileUpload/cloudinary.service';
import { FileUploadModule } from 'src/common/FileUpload/cloudinary.module';

@Module({
  imports: [ProductModel, CategoryModule, FileUploadModule],
  controllers: [ProductController],
  providers: [
    ProductService,
    ProductRepository,
    CategoryRepository,
    FileUploadService,
  ],
  exports: [ProductRepository, ProductService],
})
export class ProductModule {}
