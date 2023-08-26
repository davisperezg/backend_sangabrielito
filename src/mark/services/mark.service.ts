import {
  HttpException,
  HttpStatus,
  Injectable,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Mark, MarkDocument } from '../schemas/mark.schemas';
import { MARCAS_INDEX } from 'src/lib/const/consts';

@Injectable()
export class MarkService implements OnApplicationBootstrap {
  constructor(@InjectModel('Mark') private markModel: Model<MarkDocument>) {}

  async onApplicationBootstrap() {
    const count = await this.markModel.estimatedDocumentCount();
    if (count > 0) return;

    await this.markModel.insertMany(MARCAS_INDEX);
  }

  async findAll(): Promise<Mark[]> {
    return this.markModel.find({ status: true });
  }

  async findAllDeleted(): Promise<Mark[]> {
    return this.markModel.find({ status: false });
  }

  async restore(id: string): Promise<boolean> {
    let result = false;

    try {
      await this.markModel.findByIdAndUpdate(id, { status: true });
      result = true;
    } catch (e) {
      //throw new Error(`Error en ProductService.deleteProductById ${e}`);
    }

    return result;
  }

  async delete(id: string): Promise<boolean> {
    let result = false;

    try {
      await this.markModel.findByIdAndUpdate(id, { status: false });
      result = true;
    } catch (e) {
      //throw new Error(`Error en ProductService.deleteProductById ${e}`);
    }

    return result;
  }

  async create(createMark: Mark): Promise<Mark> {
    const { name } = createMark;

    const findMark = await this.markModel.findOne({ name });

    if (findMark) {
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

    const modifyData: Mark = {
      ...createMark,
      status: true,
    };

    const createdModule = new this.markModel(modifyData);
    return createdModule.save();
  }

  async update(id: string, bodyMark: Mark): Promise<Mark> {
    const { status } = bodyMark;

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

    return await this.markModel.findByIdAndUpdate(id, bodyMark, {
      new: true,
    });
  }

  async findMarkByName(mark: string): Promise<MarkDocument> {
    return await this.markModel.findOne({ name: mark });
  }
}
