import { Module } from '@nestjs/common';
import { cloudinaryProvider } from './cloudnairy.provider';
import { FileUploadService } from './cloudinary.service';

@Module({
  providers: [cloudinaryProvider, FileUploadService],
  exports: [cloudinaryProvider, FileUploadService],
})
export class FileUploadModule {}
