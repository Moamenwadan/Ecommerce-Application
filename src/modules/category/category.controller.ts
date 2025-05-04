import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Roles } from 'src/common/public/roles.decorator';
import { Role } from 'src/DB/models/enums/user.enum';
import { User } from 'src/common/public/param.decorator';
import { Types } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Public } from 'src/common/public/public.decorator';
import { ParseObjectIdPipe } from '@nestjs/mongoose';

@Controller('/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('/create')
  @Roles(Role.admin)
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() data: CreateCategoryDto,
    @User('_id') userId: Types.ObjectId,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // console.log(file);
    // console.log(data);
    return this.categoryService.create(data, userId, file);
  }

  @Patch('/update/:id')
  @Roles(Role.admin)
  update(
    @Param('id') categoryId: Types.ObjectId,
    @Body() body: UpdateCategoryDto,
    @User('_id') userId: Types.ObjectId,
  ) {
    return this.categoryService.update(categoryId, body, userId);
  }
  @Patch('/updateImage/:id')
  @Roles(Role.admin)
  @UseInterceptors(FileInterceptor('image'))
  updateImage(
    @Param('id') categoryId: Types.ObjectId,
    @Body() body: UpdateCategoryDto,
    @UploadedFile() file: Express.Multer.File,
    @User('_id') userId: Types.ObjectId,
  ) {
    return this.categoryService.updateImage(categoryId, body, userId, file);
  }
  @Delete(':id')
  @Roles(Role.admin)
  remove(
    @Param('id') categoryId: Types.ObjectId,
    @User('_id') userId: Types.ObjectId,
  ) {
    return this.categoryService.remove(categoryId, userId);
  }

  @Public()
  @Get()
  async findAll(@Query('page', ParseIntPipe) page: number) {
    return this.categoryService.findAll(page);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) categoryId: Types.ObjectId) {
    return this.categoryService.findOne(categoryId);
  }
}
