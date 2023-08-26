import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Unit, UnitDocument } from '../schemas/unit.schema';
import { UNIDADES_INDEX } from 'src/lib/const/consts';

@Injectable()
export class UnitMeasureService {
  constructor(@InjectModel('Unit') private unitModel: Model<UnitDocument>) {}

  async onApplicationBootstrap() {
    const count = await this.unitModel.estimatedDocumentCount();
    if (count > 0) return;

    await this.unitModel.insertMany(UNIDADES_INDEX);
  }

  async findAll(): Promise<Unit[]> {
    return this.unitModel.find({ status: true });
  }

  async findAllDeleted(): Promise<Unit[]> {
    return this.unitModel.find({ status: false });
  }

  async restore(id: string): Promise<boolean> {
    let result = false;

    try {
      await this.unitModel.findByIdAndUpdate(id, { status: true });
      result = true;
    } catch (e) {
      //throw new Error(`Error en ProductService.deleteProductById ${e}`);
    }

    return result;
  }

  async delete(id: string): Promise<boolean> {
    let result = false;

    try {
      await this.unitModel.findByIdAndUpdate(id, { status: false });
      result = true;
    } catch (e) {
      //throw new Error(`Error en ProductService.deleteProductById ${e}`);
    }

    return result;
  }

  async create(createUnit: Unit): Promise<Unit> {
    const { name } = createUnit;

    const findUnit = await this.unitModel.findOne({ name });

    if (findUnit) {
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

    const modifyData: Unit = {
      ...createUnit,
      status: true,
    };

    const createdModule = new this.unitModel(modifyData);
    return createdModule.save();
  }

  async update(id: string, bodyUnit: Unit): Promise<Unit> {
    const { status } = bodyUnit;

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

    return await this.unitModel.findByIdAndUpdate(id, bodyUnit, {
      new: true,
    });
  }

  async findUnitByName(product: string): Promise<UnitDocument> {
    return await this.unitModel.findOne({ name: product });
  }
}
