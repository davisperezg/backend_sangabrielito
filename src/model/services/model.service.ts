import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ModelDocument, ModelE } from '../schemas/model.schema';

@Injectable()
export class ModelService {
  constructor(@InjectModel('ModelE') private modModel: Model<ModelDocument>) {}

  async findAll(): Promise<ModelE[]> {
    return this.modModel.find({ status: true });
  }

  async findAllDeleted(): Promise<ModelE[]> {
    return this.modModel.find({ status: false });
  }

  async restore(id: string): Promise<boolean> {
    let result = false;

    try {
      await this.modModel.findByIdAndUpdate(id, { status: true });
      result = true;
    } catch (e) {
      //throw new Error(`Error en ProductService.deleteProductById ${e}`);
    }

    return result;
  }

  async delete(id: string): Promise<boolean> {
    let result = false;

    try {
      await this.modModel.findByIdAndUpdate(id, { status: false });
      result = true;
    } catch (e) {
      //throw new Error(`Error en ProductService.deleteProductById ${e}`);
    }

    return result;
  }

  async create(createModelE: ModelE): Promise<ModelE> {
    const { name } = createModelE;

    const findModelE = await this.modModel.findOne({ name });

    if (findModelE) {
      //No se puede crear el elemento
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          type: 'UNIQUE',
          message: 'Item cannot be created',
        },
        HttpStatus.CONFLICT,
      );
    }

    const modifyData: ModelE = {
      ...createModelE,
      status: true,
    };

    const createdModelE = new this.modModel(modifyData);
    return createdModelE.save();
  }

  async update(id: string, bodyModel: ModelE): Promise<ModelE> {
    const { status } = bodyModel;

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

    return await this.modModel.findByIdAndUpdate(id, bodyModel, {
      new: true,
    });
  }

  async findModelByName(model: string): Promise<ModelDocument> {
    return await this.modModel.findOne({ name: model });
  }
}
