import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Project extends Document {
  @Prop()
  title?: string;

  @Prop()
  category?: string;

  @Prop()
  result?: string;

  @Prop()
  imageUrl?: string;

  @Prop()
  videoUrl?: string;

  @Prop()
  link?: string;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
