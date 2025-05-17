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
import { SocketGateway } from '../socket/socket.getway';
import { SocketModule } from '../socket/socket.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/DB/repositers/user.repository';
import { TokenRepository } from 'src/DB/repositers/token.repository';

// imports: [ProductModel, CategoryModule, FileUploadModule],
@Module({
  imports: [
    ProductModel,
    CategoryModule,
    FileUploadModule,
    SocketModule,
    JwtModule,
  ],
  providers: [
    ProductService,
    ProductRepository,
    CategoryRepository,
    FileUploadService,
    SocketGateway,
    JwtService,
  ],
  controllers: [ProductController],
  exports: [ProductRepository, ProductService, SocketGateway],
})
export class ProductModule {}
