import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Project extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  result: string; 

  @Prop({ required: true })
  imageUrl: string; 

  @Prop({ required: true })
  link: string;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);