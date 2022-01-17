import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
export type ClientDocument = Client & mongoose.Document;

@Schema({ timestamps: true, versionKey: false })
export class Client {
  @Prop({ trim: true, requerid: true, uppercase: true })
  name: string;

  @Prop({ trim: true, requerid: true, uppercase: true })
  lastname: string;

  @Prop({ trim: true, requerid: true, uppercase: true })
  tipDocument: string;

  @Prop({ trim: true, requerid: true, unique: true })
  nroDocument: string;

  @Prop({ trim: true })
  cellphone: string;

  @Prop({ trim: true })
  email: string;

  @Prop({ trim: true })
  address: string;

  @Prop({ trim: true })
  status: boolean;
}

export const ClientSchema = SchemaFactory.createForClass(Client);
