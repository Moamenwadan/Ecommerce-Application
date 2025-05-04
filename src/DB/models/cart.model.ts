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
import { ProductModelName } from './product.model';
// import { FileUploadService } from 'src/common/FileUpload/cloudinary.service';
// import { cloudinaryProvider } from 'src/common/FileUpload/cloudnairy.provider';
// import { FileUploadModule } from 'src/common/FileUpload/cloudinary.module';

// class schema
@Schema({ timestamps: true })
export class Cart extends Document {
  @Prop({ type: Types.ObjectId, ref: userModelName, required: true })
  user: Types.ObjectId;

  @Prop({
    type: [
      {
        productId: {
          type: Types.ObjectId,
          ref: ProductModelName,
          // required: true,
        },
        quantity: { type: Number, default: 1 },
        price: { type: Number },
      },
    ],
  })
  products: { productId: Types.ObjectId; quantity: number; price: number }[];
}

// schema
export const CartSchema = SchemaFactory.createForClass(Cart);

// model name
export const CartModelName = Cart.name;

export const CartModel = MongooseModule.forFeature([
  { name: CartModelName, schema: CartSchema },
]);

// document type
export type CartDocument = HydratedDocument<Cart>;
