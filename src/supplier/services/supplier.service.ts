import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Supplier, SupplierDocument } from '../schemas/supplier.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class SupplierService {
  constructor(
    @InjectModel('Supplier') private supplierModel: Model<SupplierDocument>,
  ) {}

  async findAll(): Promise<Supplier[]> {
    return this.supplierModel.find({ status: true });
  }

  async findAllDeleted(): Promise<Supplier[]> {
    return this.supplierModel.find({ status: false });
  }

  async restore(id: string): Promise<boolean> {
    let result = false;

    try {
      await this.supplierModel.findByIdAndUpdate(id, { status: true });
      result = true;
    } catch (e) {
      //throw new Error(`Error en ProductService.deleteProductById ${e}`);
    }

    return result;
  }

  async delete(id: string): Promise<boolean> {
    let result = false;

    try {
      await this.supplierModel.findByIdAndUpdate(id, { status: false });
      result = true;
    } catch (e) {
      //throw new Error(`Error en ProductService.deleteProductById ${e}`);
    }

    return result;
  }

  async create(createSupplier: Supplier): Promise<Supplier> {
    const { name } = createSupplier;

    const findSupplier = await this.supplierModel.findOne({ name });

    if (findSupplier) {
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

    const modifyData: Supplier = {
      ...createSupplier,
      status: true,
    };

    const createdModule = new this.supplierModel(modifyData);
    return createdModule.save();
  }

  async update(id: string, bodySupplier: Supplier): Promise<Supplier> {
    const { status } = bodySupplier;

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

    return await this.supplierModel.findByIdAndUpdate(id, bodySupplier, {
      new: true,
    });
  }
}
