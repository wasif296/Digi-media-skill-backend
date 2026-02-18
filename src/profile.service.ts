import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile } from './profile.schema';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<Profile>,
  ) {}

  async getProfile() {
    let profile = await this.profileModel.findOne();
    if (!profile) {
      profile = await this.profileModel.create({});
    }
    return profile;
  }

  async updateProfile(data: Partial<Profile>) {
    let profile = await this.profileModel.findOne();
    if (!profile) {
      profile = await this.profileModel.create({});
    }
    Object.assign(profile, data);
    await profile.save();
    return profile;
  }
}
