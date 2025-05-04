import { IsUrl } from 'class-validator';

export class RemoveImageDto {
  @IsUrl()
  secure_url: string;
}
