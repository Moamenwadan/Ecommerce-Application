import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Types } from 'mongoose';
import { CategoryRepository } from 'src/DB/repositers/category.repository';
import { ProductRepository } from 'src/DB/repositers/product.repository';
import { FileUploadService } from 'src/common/FileUpload/cloudinary.service';
import { v4 as uuid } from 'uuid';
import { Image } from 'src/common/types/image.type';
import { FindProductsDto } from './dto/find-product.dto';
import { ProductDocument } from 'src/DB/models/product.model';
import { SocketGateway } from '../socket/socket.getway';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ProductService {
  constructor(
    private readonly _CategoryRepository: CategoryRepository,
    private readonly _ProductRepository: ProductRepository,
    private readonly _FileUploadService: FileUploadService,
    private readonly _SocketGateway: SocketGateway,
    @Inject(CACHE_MANAGER) private readonly cacheManger: Cache,
  ) {}
  async create(
    data: CreateProductDto,
    userId: Types.ObjectId,
    categoryId: Types.ObjectId,
    files: Record<string, Express.Multer.File[]>,
  ) {
    const category = await this._CategoryRepository.findOne({
      filter: { _id: categoryId },
    });
    if (!category) throw new BadRequestException("this category doesn'texist");
    const productExist = await this._ProductRepository.findOne({
      filter: { name: data.name },
    });
    if (productExist)
      throw new BadRequestException('this name of product is already exist');
    const cloudFolder = uuid();
    const [thumbnail] = await this._FileUploadService.saveFileToCloud(
      files.thumbnail,
      {
        folder: `ecommerce/product/${cloudFolder}`,
      },
    );
    // const photos =  await this._FileUploadService.saveFileToCloud(
    //   files.thumbnail,
    //   {
    //     folder: `ecommerce/product/${cloudFolder}`,
    //   },
    // );
    // console.log(photos)
    // console.log(thumbnail)
    let images: Image[] | undefined;
    if (files?.images) {
      images = await this._FileUploadService.saveFileToCloud(files.images, {
        folder: `ecommerce/product/${cloudFolder}`,
      });
    }
    const product = await this._ProductRepository.create({
      ...data,
      cloudFolder: `ecommerce/product/${cloudFolder}`,
      createdBy: userId,
      category: categoryId,
      thumbnail,
      ...(images && { images }),
    });

    return { success: true, data: product };
  }

  async update(
    data: UpdateProductDto,
    productId: Types.ObjectId,
    userId: Types.ObjectId,
  ) {
    const product = await this._ProductRepository.update({
      filter: { _id: productId, createdBy: userId },
      update: { ...data },
    });
    if (!product) throw new NotFoundException("this product doesn't exist");
    return { success: true, data: product };
  }
  async removeImage(
    secure_url: string,
    productId: Types.ObjectId,
    userId: Types.ObjectId,
  ) {
    const product = await this._ProductRepository.findOne({
      filter: {
        _id: productId,
        createdBy: userId,
        $or: [
          { 'thumbnail.secure_url': secure_url },
          { 'images.secure_url': secure_url },
        ],
      },
    });
    if (!product) throw new NotFoundException("this product doesn't exist");

    const { thumbnail, images } = product;
    if (thumbnail?.secure_url == secure_url) {
      if (!images?.length)
        throw new BadRequestException(
          "can't remove the only exist image,please upload anotherr one first ",
        );

      await this._FileUploadService.deleteFiles([thumbnail.public_id]);
      // replace the thumbnail

      // هاخد صوره من اللى فى الداتا بيس فى الصور واحطها سبنال
      const lastImage = images[images.length - 1];
      product.thumbnail = lastImage;
      // remove the images from database
      product.images.pop();
    } else {
      const imageToRemove = images?.find((img) => img.secure_url == secure_url);
      await this._FileUploadService.deleteFiles([imageToRemove!.public_id]);
      product.images = images.filter((img) => img.secure_url != secure_url);
    }
    await product.save();
    return { success: true, data: product };
  }
  async addImage(
    // secure_url: string,
    productId: Types.ObjectId,
    userId: Types.ObjectId,
    isThumbnail: boolean,
    image: Express.Multer.File,
  ) {
    const product = await this._ProductRepository.findOne({
      filter: {
        _id: productId,
        createdBy: userId,
      },
    });
    if (!product) throw new NotFoundException("this product doesn't exist");
    if (!image)
      throw new BadRequestException('you should send file type image');
    if (isThumbnail) {
      const [thumbnail] = await this._FileUploadService.saveFileToCloud(
        [image],
        { public_id: product.thumbnail.public_id },
      );
      product.thumbnail = thumbnail;
    } else {
      const results = await this._FileUploadService.saveFileToCloud([image], {
        folder: product.cloudFolder,
      });
      // console.log(results[0]);
      product.images.push(results[0]);
    }
    await product.save();

    return { success: true, data: product };
  }
  async remove(productId: Types.ObjectId, userId: Types.ObjectId) {
    const product = await this._ProductRepository.findOne({
      filter: { _id: productId },
    });
    if (!product) throw new BadRequestException("the product doesn't exist");
    await this._FileUploadService.deleteFolder(product.cloudFolder);
    const deleteProduct = await this._ProductRepository.delete({
      _id: productId,
    });
    return { success: true, message: 'delete product is successfully occur' };
  }
  async findAll(query: FindProductsDto) {
    const key = `products ${JSON.stringify(query)}`;
    const cached = await this.cacheManger.get(key);
    if (cached) return { data: cached };
    const products = await this._ProductRepository.findAll({
      filter: {
        ...(query.category && {
          category: new Types.ObjectId(query.category),
        }),
        ...(query.k && {
          $or: [
            { name: { $regex: query.k, $options: 'i' } },
            { description: { $regex: query.k, $options: 'i' } },
          ],
        }),
        ...(query.price && {
          finalPrice: {
            // finalprice:{$gte:query.price.min}
            // finalprice:{$gte:query.price.min}
            ...(query.price.min !== undefined && { $lte: query.price.min }),
            ...(query.price.max !== undefined && { $lte: query.price.max }),
          },
        }),
      },
      sort: {
        ...(query.sort?.by && {
          [query.sort?.by]: query.sort.dir ? Number(query.sort.dir) : 1,
        }),
      },
      paginate: { page: query.page },
    });
    await this.cacheManger.set(key, products);
    return { success: true, data: products };
  }
  inStock(product: ProductDocument, requiredQuantity: number) {
    return product.stock >= requiredQuantity ? true : false;
  }
  async checkProductExistence(productId: Types.ObjectId) {
    const product = await this._ProductRepository.findOne({
      filter: { _id: productId },
    });
    if (!product) throw new BadRequestException("the product doesn't exist");
    return product;
  }

  async updateStock(productId: Types.ObjectId, quantity: number, inc: boolean) {
    const product = await this._ProductRepository.update({
      filter: { _id: productId },
      update: { $inc: { stock: inc ? quantity : -quantity } },
    });
    if (!product) throw new BadRequestException('kjlk');

    // socket
    this._SocketGateway.broadCatStockUpdate(
      product!._id as Types.ObjectId,
      product?.stock,
    );

    return product;
  }

  async testRedis() {
    await this.cacheManger.set('testnestjs', 'Hi from testredis');

    const result = await this.cacheManger.get('testnestjs');
    return { data: result };
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }
}
