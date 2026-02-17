import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage } from '../cloudinary-storage';

@Controller('upload')
export class UploadController {
  @Post()
  @UseInterceptors(FileInterceptor('file', { storage }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file || !file.path) {
      return { error: 'Cloudinary upload failed or file not supported.' };
    }
    return { url: file.path };
  }
}
