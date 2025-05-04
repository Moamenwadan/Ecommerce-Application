import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';

export class thumbnailRequiredPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value || !value.thumbnail)
      throw new BadRequestException('thumbnail is required ');
    return value;
  }
}
