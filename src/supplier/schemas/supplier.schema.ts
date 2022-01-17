import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
export type SupplierDocument = Supplier & mongoose.Document;

@Schema({ timestamps: true, versionKey: false })
export class Supplier {
  @Prop({ trim: true, uppercase: true })
  name: string;

  @Prop({ trim: true, uppercase: true })
  contact: string;

  @Prop({ trim: true, uppercase: true })
  tipDocument: string;

  @Prop({ trim: true })
  nroDocument: string;

  @Prop({ trim: true, unique: true, required: true })
  cellphone: string;

  @Prop({ trim: true, unique: true })
  email: string;

  @Prop({ trim: true })
  address: string;

  @Prop({ trim: true })
  obs: string;

  @Prop({ trim: true })
  status: boolean;
}

export const SupplierSchema = SchemaFactory.createForClass(Supplier);
