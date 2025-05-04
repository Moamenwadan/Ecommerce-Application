import { Inject, Injectable } from '@nestjs/common';
import {
  v2 as Cloudinary,
  UpdateApiOptions,
  UploadApiOptions,
  UploadApiResponse,
} from 'cloudinary';
// import { error } from 'console';
import { Image } from '../types/image.type';
import { CLOUDINARY } from './cloudnairy.provider';

@Injectable()
export class FileUploadService {
  constructor(
    @Inject(CLOUDINARY) private readonly cloudinary: typeof Cloudinary,
  ) {}
  async uploadCloud(
    buffer: Buffer,
    options: UploadApiOptions,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      this.cloudinary.uploader
        .upload_stream(options, (error, result) => {
          if (error) return reject(error);
          // console.log('Cloudinary response:', result);
          return resolve(result!);
        })
        .end(buffer);
    });
  }
  async saveFileToCloud(
    files: Express.Multer.File[],
    options: UploadApiOptions,
  ) {
    let savedFiles: Image[] = [];
    for (const file of files) {
      let buffer = file.buffer;
      // console.log(buffer);
      //   console.log(file);
      //   console.log(buffer);
      //   console.log(folder);
      const { secure_url, public_id } = await this.uploadCloud(buffer, options);
      savedFiles.push({ secure_url, public_id });
      //   console.log(savedFiles);
    }
    return savedFiles;
  }

  async deleteFiles(publicIds: string[]) {
    await this.cloudinary.api.delete_resources(publicIds);
  }
  async deleteFolder(folderPath: string) {
    //عشان امسح الملفات اللى داخل المجلدات
    await this.cloudinary.api.delete_resources_by_prefix(folderPath);
    // عشان لو مجلد جواه مجلدات تانيه امسح كل المجلدات اللى جواه عن طريق الريكرشن
    const subFolders = await this.cloudinary.api.sub_folders(folderPath);
    if (subFolders.length) {
      for (const subFolder of subFolders.folders) {
        // recursion
        await this.deleteFolder(subFolder.path);
      }
    }
    await this.cloudinary.api.delete_folder(folderPath);
  }
}
