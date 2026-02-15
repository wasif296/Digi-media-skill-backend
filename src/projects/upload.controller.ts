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
  uploadFile(@UploadedFile() file: any) {
    return { url: file.path };
  }
}
