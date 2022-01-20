import { Module } from './../../module/schemas/module.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Role } from 'src/role/schemas/role.schema';
export type ModuleOptionsDocument = ModuleOptions & mongoose.Document;

@Schema({ timestamps: true, versionKey: false })
export class ModuleOptions {
  @Prop({ trim: true })
  status: boolean;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module',
  })
  role?: Role;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module',
  })
  module?: Module;

  @Prop({ trim: true })
  canCreate: boolean;

  @Prop({ trim: true })
  canRead: boolean;

  @Prop({ trim: true })
  canDelete: boolean;

  @Prop({ trim: true })
  canUpdate: boolean;

  @Prop({ trim: true })
  canRestore: boolean;
}

export const ModuleOptionsSchema = SchemaFactory.createForClass(ModuleOptions);
