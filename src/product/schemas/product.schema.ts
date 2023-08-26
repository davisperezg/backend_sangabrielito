import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Area } from 'src/area/schemas/area.schema';
import { Mark } from 'src/mark/schemas/mark.schemas';
import { Mdel } from 'src/model/schemas/model.schema';
import { Unit } from 'src/unit-measure/schemas/unit.schema';
export type ProductDocument = Product & mongoose.Document;

@Schema({ timestamps: true, versionKey: false })
export class Product {
  @Prop({ trim: true, uppercase: true, required: true, unique: true })
  cod_internal: string;

  @Prop({ trim: true, uppercase: true })
  cod_barra?: string;

  @Prop({ trim: true, uppercase: true })
  nroSerie?: string;

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
    ref: 'Mdel',
    required: true,
  })
  model: Mdel;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Unit',
    required: true,
  })
  unit: Unit;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Area',
    required: true,
  })
  area: Area;

  @Prop({ required: false })
  stock: number;

  @Prop({ required: false })
  price: number;

  @Prop({ required: false })
  price_c: number;

  @Prop({ trim: true })
  fecVen: Date;

  @Prop({ trim: true })
  fecInicioUso?: Date;

  @Prop({ trim: true })
  fecAquision?: Date;

  @Prop({ trim: true })
  ubicacionLocal?: string;

  @Prop({ trim: true })
  areaLocal?: string;

  @Prop({ trim: true })
  lugarLocal?: string;

  @Prop({ trim: true })
  status: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
