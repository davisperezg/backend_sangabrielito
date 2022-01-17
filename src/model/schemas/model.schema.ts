import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
export type ModelDocument = ModelE & mongoose.Document;

@Schema({ timestamps: true, versionKey: false })
export class ModelE {
  @Prop({ trim: true, unique: true, uppercase: true })
  name: string;

  @Prop({ trim: true })
  status: boolean;
}

export const ModelESchema = SchemaFactory.createForClass(ModelE);
