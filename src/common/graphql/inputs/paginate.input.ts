import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional } from 'class-validator';

@InputType()
export class paginateInput {
  @Field(() => Int)
  @IsOptional()
  @IsNumber()
  page: number;
}
