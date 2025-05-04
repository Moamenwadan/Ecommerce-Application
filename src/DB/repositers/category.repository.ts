import { Injectable } from '@nestjs/common';
import { AbstractRepositry } from './abstract.repositry';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Category,
  CategoryDocument,
  CategoryModelName,
} from '../models/category.model';

@Injectable()
export class CategoryRepository extends AbstractRepositry<CategoryDocument> {
  constructor(
    @InjectModel(CategoryModelName) Category: Model<CategoryDocument>,
  ) {
    super(Category);
  }
}
