import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
export type UnitDocument = Unit & mongoose.Document;

@Schema({ timestamps: true, versionKey: false })
export class Unit {
  @Prop({ trim: true, unique: true, uppercase: true })
  name: string;

  @Prop({ trim: true })
  status: boolean;
}

export const UnitSchema = SchemaFactory.createForClass(Unit);
