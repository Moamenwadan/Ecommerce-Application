import { Document, HydratedDocument, Types } from 'mongoose';
import {
  MongooseModule,
  Prop,
  SchemaFactory,
  Schema,
  raw,
} from '@nestjs/mongoose';

import { userModelName } from './user.model';
import { Image } from 'src/common/types/image.type';
import { FileUploadService } from 'src/common/FileUpload/cloudinary.service';
import { cloudinaryProvider } from 'src/common/FileUpload/cloudnairy.provider';
import { FileUploadModule } from 'src/common/FileUpload/cloudinary.module';

// class schema
@Schema({ timestamps: true })
export class Category extends Document {
  @Prop({ type: String, unique: true, required: true })
  name: string;

  @Prop({ type: String, unique: true, required: true })
  slug: string;

  @Prop({ type: Types.ObjectId, ref: userModelName, required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: userModelName })
  updatedBy: Types.ObjectId;

  @Prop(raw({ secure_url: String, public_id: String }))
  image: Image;

  @Prop({ type: String })
  cloudFolder: string;
}

// schema
export const CategorySchema = SchemaFactory.createForClass(Category);

// pre-save hook to generate slug
// CategorySchema.pre('save', function (next) {
//   if (this.isModified('name')) {
//     this.slug = slugify(this.name, { lower: true });
//   }
//   next();
// });

// model name
export const CategoryModelName = Category.name;

// model module
// export const CategoryModel = MongooseModule.forFeature([
//   { name: CategoryModelName, schema: CategorySchema },
// ]);
export const CategoryModel = MongooseModule.forFeatureAsync([
  {
    name: CategoryModelName,
    useFactory: (fileUploadService: FileUploadService) => {
      CategorySchema.post(
        'deleteOne',
        { document: true, query: false },
        async function (doc) {
          const CategoryFolderPath = doc.cloudFolder;
          await fileUploadService.deleteFolder(
            `ecommerce/category/${doc.cloudFolder}`,
          );
        },
      );
      return CategorySchema;
    },
    inject: [FileUploadService],
    imports: [FileUploadModule],
  },
]);

// document type
export type CategoryDocument = HydratedDocument<Category>;
