import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Area } from 'src/area/schemas/area.schema';

export type SequenceDocument = Sequence & mongoose.Document;

@Schema({ timestamps: true, versionKey: false })
export class Sequence {
  @Prop({ trim: true, required: true })
  sequence: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Area',
    required: true,
    unique: true,
  })
  area: Area;
}

export const SequenceSchema = SchemaFactory.createForClass(Sequence);
