import { Inject } from '@nestjs/common';
export const CLOUDINARY = 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { v2 as Cloudinary } from 'cloudinary';

export const cloudinaryProvider = {
  provide: 'cloudinary',
  useFactory: (configService: ConfigService) => {
    Cloudinary.config({
      cloud_name: configService.get('CLOUD_NAME') || 'dr4po5j8x',
      api_key: configService.get('API_KEY') || '671723232855865',
      api_secret:
        configService.get('API_SECRET') || 'LDl2Y6ptAgv888Ag4S7w49kQOv8',
    });
    return Cloudinary; // لازم ترجع الكلاوديناري هنا
  },
  inject: [ConfigService], // ✅ حروف صغيرة
};
