import { Body, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryRepository } from 'src/DB/repositers/category.repository';
import { Types } from 'mongoose';
import { FileUploadService } from 'src/common/FileUpload/cloudinary.service';
import { ConfigService } from '@nestjs/config';
import slugify from 'slugify';
import { v4 as uuid } from 'uuid';
// import path from 'path';
@Injectable()
export class CategoryService {
  constructor(
    private readonly _CategoryRepository: CategoryRepository,
    private readonly _ConfigService: ConfigService,
    private readonly _FileUploadService: FileUploadService,
    // private _CategoryService: CategoryService,
  ) {}
  async create(
    data: CreateCategoryDto,
    userId: Types.ObjectId,
    file: Express.Multer.File,
  ) {
    // const rootFolder = this._ConfigService.get('CLOUD_ROOT_FOLDER');
    const cloudFolder = uuid();
    const results = await this._FileUploadService.saveFileToCloud([file], {
      folder: `ecommerce/category/${cloudFolder}`,
    });
    const slug = slugify(data.name, { lower: true });

    const category = await this._CategoryRepository.create({
      name: data.name,
      slug,
      cloudFolder,
      image: results[0],
      createdBy: userId,
    });

    return { success: true, category };
  }
  async update(
    categoryId: Types.ObjectId,
    body: UpdateCategoryDto,
    userId: Types.ObjectId,
  ) {
    // console.log(body);
    // console.log(categoryId);
    // console.log(userId);

    const category = await this._CategoryRepository.findOne({
      filter: { _id: categoryId },
    });
    if (!category)
      throw new NotFoundException(
        `category with this ${categoryId} is not found`,
      );
    // console.log(category);

    if (body.name) {
      category.name = body.name;
      category.updatedBy = userId;
      const slug = slugify(body.name);
      category.slug = slug;
      await category.save();
    }

    return { success: true, data: category };
  }
  async updateImage(
    categoryId: Types.ObjectId,
    body: UpdateCategoryDto,
    userId: Types.ObjectId,
    file: Express.Multer.File,
  ) {
    const category = await this._CategoryRepository.findOne({
      filter: { _id: categoryId },
    });
    if (!category)
      throw new NotFoundException(
        `category with this ${categoryId} is not found`,
      );
    const public_id = category.image.public_id;

    const results = await this._FileUploadService.saveFileToCloud([file], {
      public_id,
    });
    console.log(results);
    category.image = results[0];
    category.updatedBy = userId;
    await category.save();

    return { success: true, data: category };
  }
  async remove(categoryId: Types.ObjectId, userId: Types.ObjectId) {
    const category = await this._CategoryRepository.findOne({
      filter: { _id: categoryId },
    });
    if (!category)
      throw new NotFoundException(
        `category with this ${categoryId} is not found`,
      );

    await category.deleteOne();
    return { message: 'delete file successfully' };
  }
  async findAll(page: number) {
    const categories = await this._CategoryRepository.findAll({
      filter: {},
      populate: [{ path: 'createdBy' }],
      paginate: { page: page },
    });
    return { success: true, data: categories };
  }

  async findOne(categoryId: Types.ObjectId) {
    const category = await this._CategoryRepository.findOne({
      filter: { _id: categoryId },
    });
    return { success: true, data: category };
  }
}
