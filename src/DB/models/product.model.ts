import { Document, HydratedDocument, Types } from 'mongoose';
import {
  MongooseModule,
  Prop,
  SchemaFactory,
  Schema,
  raw,
} from '@nestjs/mongoose';

import { Image } from 'src/common/types/image.type';
import { userModelName } from './user.model';
import { CategoryModelName } from './category.model';
import slugify from 'slugify';
// import { FileUploadService } from 'src/common/FileUpload/cloudinary.service';
// import { cloudinaryProvider } from 'src/common/FileUpload/cloudnairy.provider';
// import { FileUploadModule } from 'src/common/FileUpload/cloudinary.module';

// class schema
@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({
    type: String,
    unique: true,
    required: true,
    index: { name: 'product_name_index' },
    set: function (value: string) {
      this.slug = slugify(value);
      return value;
    },
  })
  name: string;
  @Prop({
    type: String,
  })
  description: string;

  @Prop({ type: String, unique: true })
  slug: string;

  @Prop({ type: Types.ObjectId, ref: userModelName, required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: userModelName })
  updatedBy: Types.ObjectId;

  @Prop(raw({ secure_url: String, public_id: String }))
  thumbnail: Image;
  @Prop({ type: [{ secure_url: String, public_id: String }] })
  images: Image[];

  @Prop({ type: String })
  cloudFolder: string;
  @Prop({ type: Types.ObjectId, ref: CategoryModelName, required: true })
  category: Types.ObjectId;
  @Prop({ type: Number, required: true, min: 1 })
  stock: number;
  @Prop({ type: Number, required: true })
  price: number;
  @Prop({
    type: Number,
    min: 0,
    max: 100,
  })
  discount: number;
  @Prop({
    type: Number,
    default: function () {
      return this.price - (this.price * this.discount || 0) / 100;
    },
  })
  finalPrice: number;
  @Prop({ type: Number, min: 0, max: 5 })
  rating: number;
}

// schema
export const ProductSchema = SchemaFactory.createForClass(Product);

// model name
export const ProductModelName = Product.name;

export const ProductModel = MongooseModule.forFeature([
  { name: ProductModelName, schema: ProductSchema },
]);

// document type
export type ProductDocument = HydratedDocument<Product>;
