import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Mark } from 'src/mark/schemas/mark.schemas';
import { ModelE } from 'src/model/schemas/model.schema';
import { Unit } from 'src/unit-measure/schemas/unit.schema';
export type ProductDocument = Product & mongoose.Document;

@Schema({ timestamps: true, versionKey: false })
export class Product {
  @Prop({ trim: true })
  cod_internal: string;

  @Prop({ trim: true, uppercase: true, required: true })
  name: string;

  @Prop({ trim: true })
  note: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mark',
    required: true,
  })
  mark: Mark;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ModelE',
    required: true,
  })
  model: ModelE;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Unit',
    required: true,
  })
  unit: Unit;

  @Prop({ trim: true, required: true })
  stock: number;

  @Prop({ trim: true, required: true })
  price: number;

  @Prop({ trim: true })
  status: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
