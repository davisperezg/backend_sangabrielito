import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Fact } from 'src/fact/schemas/fact.schema';
import { Product } from 'src/product/schemas/product.schema';
export type Fact_DetailsDocument = Fact_Details & mongoose.Document;

@Schema({ timestamps: true, versionKey: false })
export class Fact_Details {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Fact',
    required: true,
  })
  fact: Fact;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  })
  product: Product;

  @Prop({ trim: true, required: true })
  quantity: number;

  @Prop({ trim: true, required: true })
  price: number;

  @Prop({ trim: true, required: true })
  discount: number;

  @Prop({ trim: true, required: true })
  status: boolean;
}

export const Fact_DetailsSchema = SchemaFactory.createForClass(Fact_Details);
