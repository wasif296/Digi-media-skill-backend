import {
  Controller,
  Get,
  Put,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { uploadToCloudinary } from './cloudinary';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  async getProfile() {
    return this.profileService.getProfile();
  }

  @Put()
  @UseInterceptors(FileInterceptor('avatar'))
  async updateProfile(
    @Body() body: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    let avatarUrl = body.avatarUrl;
    if (file) {
      const upload = await uploadToCloudinary(file);
      avatarUrl = upload.secure_url;
    }
    return this.profileService.updateProfile({
      ...body,
      avatarUrl,
    });
  }
}
