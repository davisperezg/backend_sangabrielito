import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Client } from 'src/client/schemas/client.schema';
import { User } from 'src/user/schemas/user.schema';
export type FactDocument = Fact & mongoose.Document;

@Schema({ timestamps: true, versionKey: false })
export class Fact {
  @Prop({ trim: true, unique: true, uppercase: true })
  cod_fact: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user: User;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  })
  client: Client;

  @Prop({ trim: true, required: true })
  payment_type: string; //contado o credito

  @Prop({ trim: true, required: true })
  way_to_pay: string; //efectivo completo, efectivo con vuelto o yape

  @Prop({ trim: true })
  obs: string;

  @Prop({ trim: true, required: true })
  subtotal: number;

  @Prop({ trim: true, required: true })
  discount: number;

  @Prop({ trim: true, required: true })
  customer_payment: number;

  @Prop({ trim: true, required: true })
  status: boolean;
}

export const FactSchema = SchemaFactory.createForClass(Fact);
