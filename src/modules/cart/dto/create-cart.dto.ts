import { IsInt, IsMongoId, IsPositive, Min } from 'class-validator';
import { Types } from 'mongoose';

export class CreateCartDto {
  @IsMongoId()
  productId: Types.ObjectId;

  @IsInt()
  @IsPositive()
  @Min(1)
  quantity: number;
}
