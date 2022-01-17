import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
export type MarkDocument = Mark & mongoose.Document;

@Schema({ timestamps: true, versionKey: false })
export class Mark {
  @Prop({ trim: true, unique: true, uppercase: true })
  name: string;

  @Prop({ trim: true })
  status: boolean;
}

export const MarkSchema = SchemaFactory.createForClass(Mark);
