import {
  HttpException,
  HttpStatus,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Area, AreaDocument } from '../schemas/area.schema';

@Injectable()
export class AreaService implements OnModuleInit {
  constructor(@InjectModel('Area') private areaModel: Model<AreaDocument>) {}

  async onModuleInit() {
    const count = await this.areaModel.estimatedDocumentCount();
    if (count > 0) return;
    try {
      await Promise.all([
        new this.areaModel({
          name: 'SIN ASIGNAR',
          status: true,
        }).save(),
      ]);
    } catch (e) {
      throw new Error(`Error en AreaService.onModuleInit ${e}`);
    }
  }

  async findAll(): Promise<Area[]> {
    return this.areaModel.find({ status: true });
  }

  async findAllDeleted(): Promise<Area[]> {
    return this.areaModel.find({ status: false });
  }

  async restore(id: string): Promise<boolean> {
    let result = false;

    try {
      await this.areaModel.findByIdAndUpdate(id, { status: true });
      result = true;
    } catch (e) {
      //throw new Error(`Error en ProductService.deleteProductById ${e}`);
    }

    return result;
  }

  async delete(id: string): Promise<boolean> {
    let result = false;

    try {
      await this.areaModel.findByIdAndUpdate(id, { status: false });
      result = true;
    } catch (e) {
      //throw new Error(`Error en ProductService.deleteProductById ${e}`);
    }

    return result;
  }

  async create(createArea: Area): Promise<Area> {
    const { name } = createArea;

    const findArea = await this.areaModel.findOne({ name });

    if (findArea) {
      //No se puede crear el elemento
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          type: 'UNIQUE',
          message: 'El area ya existe.',
        },
        HttpStatus.CONFLICT,
      );
    }

    const modifyData: Area = {
      ...createArea,
      status: true,
    };

    const createdModule = new this.areaModel(modifyData);
    return createdModule.save();
  }

  async update(id: string, bodyArea: Area): Promise<Area> {
    const { status, name } = bodyArea;

    if (status) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          type: 'UNAUTHORIZED',
          message: 'Unauthorized Exception',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const findArea = await this.areaModel.findOne({ name });

    if (findArea && findArea._id.toString() !== id.toString()) {
      //Si rol no existe
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          type: 'UNIQUE',
          message: 'El area ya existe.',
        },
        HttpStatus.CONFLICT,
      );
    }

    return await this.areaModel.findByIdAndUpdate(id, bodyArea, {
      new: true,
    });
  }

  async findAreaByName(area: string): Promise<AreaDocument> {
    return await this.areaModel.findOne({ name: area });
  }
}
