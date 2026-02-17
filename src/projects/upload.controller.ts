import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { v2 as cloudinary } from 'cloudinary';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/webm'];
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

@Controller('upload')
export class UploadController {
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      fileFilter: (req, file, cb) => {
        const isImage = ALLOWED_IMAGE_TYPES.includes(file.mimetype);
        const isVideo = ALLOWED_VIDEO_TYPES.includes(file.mimetype);

        if (!isImage && !isVideo) {
          cb(
            new BadRequestException(
              `File type not allowed. Allowed types: ${[...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES].join(', ')}`,
            ),
            false,
          );
        } else {
          cb(null, true);
        }
      },
      limits: { fileSize: MAX_FILE_SIZE },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded.');
    }

    try {
      const isVideo = ALLOWED_VIDEO_TYPES.includes(file.mimetype);
      const resourceType = isVideo ? 'video' : 'image';

      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'digi-media-uploads',
            resource_type: resourceType,
            public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
            timeout: 60000,
          },
          (error, result) => {
            if (error) {
              console.error('Cloudinary upload error:', error);
              reject(new BadRequestException(`Upload failed: ${error.message}`));
            } else if (!result) {
              reject(new BadRequestException('Upload failed: No result returned from Cloudinary'));
            } else {
              console.log(`✅ ${resourceType.toUpperCase()} uploaded successfully:`, result.secure_url);
              resolve({
                url: result.secure_url,
                filename: file.originalname,
                type: resourceType,
                size: file.size,
                cloudinaryId: result.public_id,
                message: `${resourceType} uploaded successfully to Cloudinary`,
              });
            }
          },
        );

        uploadStream.on('error', (error) => {
          console.error('Stream error:', error);
          reject(new BadRequestException(`Upload stream error: ${error.message}`));
        });

        uploadStream.end(file.buffer);
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Upload error:', errorMessage);
      throw new BadRequestException(`Upload failed: ${errorMessage}`);
    }
  }
}
