import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Fact, FactDocument } from '../schemas/fact.schema';

@Injectable()
export class FactService {
  constructor(@InjectModel('Fact') private factModel: Model<FactDocument>) {}

  async findAll(): Promise<Fact[]> {
    return this.factModel.find({ status: true });
  }

  async findAllDeleted(): Promise<Fact[]> {
    return this.factModel.find({ status: false });
  }

  async restore(id: string): Promise<boolean> {
    let result = false;

    try {
      await this.factModel.findByIdAndUpdate(id, { status: true });
      result = true;
    } catch (e) {
      //throw new Error(`Error en ProductService.deleteProductById ${e}`);
    }

    return result;
  }

  async delete(id: string): Promise<boolean> {
    let result = false;

    try {
      await this.factModel.findByIdAndUpdate(id, { status: false });
      result = true;
    } catch (e) {
      //throw new Error(`Error en ProductService.deleteProductById ${e}`);
    }

    return result;
  }

  async create(createFact: Fact): Promise<Fact> {
    const { cod_fact } = createFact;

    const findFact = await this.factModel.findOne({ cod_fact });

    if (findFact) {
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

    const modifyData: Fact = {
      ...createFact,
      status: true,
    };

    const createdModule = new this.factModel(modifyData);
    return createdModule.save();
  }

  async update(id: string, bodyFact: Fact): Promise<Fact> {
    const { status } = bodyFact;

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

    return await this.factModel.findByIdAndUpdate(id, bodyFact, {
      new: true,
    });
  }

  async findFactByName(fact: string): Promise<FactDocument> {
    return await this.factModel.findOne({ name: fact });
  }
}
