import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { CategoryRepository } from 'src/DB/repositers/category.repository';
import { CategoryModel } from 'src/DB/models/category.model';
import { cloudinaryProvider } from 'src/common/FileUpload/cloudnairy.provider';
import { FileUploadService } from 'src/common/FileUpload/cloudinary.service';

@Module({
  imports: [CategoryModel],
  controllers: [CategoryController],
  providers: [
    CategoryService,
    CategoryRepository,
    cloudinaryProvider,
    FileUploadService,
  ],
  exports: [CategoryService, CategoryRepository, CategoryModel],
})
export class CategoryModule {}
