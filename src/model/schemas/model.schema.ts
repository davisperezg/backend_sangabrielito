import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
export type MdelDocument = Mdel & mongoose.Document;

@Schema({ timestamps: true, versionKey: false })
export class Mdel {
  @Prop({ trim: true, unique: true, uppercase: true })
  name: string;

  @Prop({ trim: true })
  status: boolean;
}

export const MdelSchema = SchemaFactory.createForClass(Mdel);
