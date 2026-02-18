import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'profile', timestamps: true })
export class Profile extends Document {
  @Prop({ required: true, default: 'Your Name Here' })
  name: string;

  @Prop({ required: true, default: 'Digital Marketing Manager' })
  title: string;

  @Prop({ required: false })
  intro?: string;

  @Prop({ required: false })
  avatarUrl?: string;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
