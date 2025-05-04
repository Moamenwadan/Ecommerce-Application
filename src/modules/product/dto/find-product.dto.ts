import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
  min,
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';
class PriceDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  min?: number;
  @IsOptional()
  @Type(() => Number)
  max?: number;
}
class SortDto {
  @IsOptional()
  @IsString()
  by?: string;
  @IsOptional()
  @Type(() => Number)
  @IsIn([1, -1])
  dir?: number;
}
export class FindProductsDto {
  // @IsString()
  @IsOptional()
  @IsMongoId()
  category?: Types.ObjectId;
  @IsOptional()
  @IsString()
  k?: string;
  @IsOptional()
  @ValidateNested()
  @Type(() => PriceDto)
  price?: PriceDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => SortDto)
  sort?: SortDto;
  // sort?: SortDto;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Min(1)
  @Type(() => Number)
  page?: number;
}
