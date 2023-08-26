import {
  HttpException,
  HttpStatus,
  Injectable,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MdelDocument, Mdel } from '../schemas/model.schema';
import { CATEGORIAS_INDEX } from 'src/lib/const/consts';

@Injectable()
export class ModelService implements OnApplicationBootstrap {
  constructor(@InjectModel('Mdel') private modModel: Model<MdelDocument>) {}

  async onApplicationBootstrap() {
    const count = await this.modModel.estimatedDocumentCount();
    if (count > 0) return;

    await this.modModel.insertMany(CATEGORIAS_INDEX);
  }

  async findAll(): Promise<Mdel[]> {
    return this.modModel.find({ status: true });
  }

  async findAllDeleted(): Promise<Mdel[]> {
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

  async create(createMdel: Mdel): Promise<Mdel> {
    const { name } = createMdel;

    const findMdel = await this.modModel.findOne({ name });

    if (findMdel) {
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

    const modifyData: Mdel = {
      ...createMdel,
      status: true,
    };

    const createdMdel = new this.modModel(modifyData);
    return createdMdel.save();
  }

  async update(id: string, bodyModel: Mdel): Promise<Mdel> {
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

  async findModelByName(model: string): Promise<MdelDocument> {
    return await this.modModel.findOne({ name: model });
  }
}
