import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type AreaDocument = Area & mongoose.Document;

@Schema({ timestamps: true, versionKey: false })
export class Area {
  @Prop({ trim: true, unique: true, required: true, uppercase: true })
  name: string;

  @Prop({ trim: true, required: true })
  status: boolean;
}

export const AreaSchema = SchemaFactory.createForClass(Area);
