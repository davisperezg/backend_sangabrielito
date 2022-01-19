import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MarkService } from 'src/mark/services/mark.service';
import { ModelService } from 'src/model/services/model.service';
import { UnitMeasureService } from 'src/unit-measure/services/unit-measure.service';
import { Product, ProductDocument } from '../schemas/product.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product') private productModel: Model<ProductDocument>,
    private readonly markService: MarkService,
    private readonly modelService: ModelService,
    private readonly unitService: UnitMeasureService,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productModel.find({ status: true }).populate([
      {
        path: 'mark',
      },
      {
        path: 'model',
      },
      {
        path: 'unit',
      },
    ]);
  }

  async findAllDeleted(): Promise<Product[]> {
    return this.productModel.find({ status: false }).populate([
      {
        path: 'mark',
      },
      {
        path: 'model',
      },
      {
        path: 'unit',
      },
    ]);
  }

  async restore(id: string): Promise<boolean> {
    let result = false;

    try {
      await this.productModel.findByIdAndUpdate(id, { status: true });
      result = true;
    } catch (e) {
      //throw new Error(`Error en ProductService.deleteProductById ${e}`);
    }

    return result;
  }

  async delete(id: string): Promise<boolean> {
    let result = false;

    try {
      await this.productModel.findByIdAndUpdate(id, { status: false });
      result = true;
    } catch (e) {
      //throw new Error(`Error en ProductService.deleteProductById ${e}`);
    }

    return result;
  }

  async create(createProduct: Product): Promise<Product> {
    const { mark, model, unit } = createProduct;

    const getMark = await this.markService.findMarkByName(String(mark));
    const getModel = await this.modelService.findModelByName(String(model));
    const getUnit = await this.unitService.findUnitByName(String(unit));

    const modifyData: Product = {
      ...createProduct,
      mark: getMark._id,
      model: getModel._id,
      unit: getUnit._id,
      status: true,
    };

    const createdProduct = new this.productModel(modifyData);
    return createdProduct.save();
  }

  async update(id: string, bodyProduct: Product): Promise<Product> {
    const { mark, model, unit, status } = bodyProduct;

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

    const getMark = await this.markService.findMarkByName(String(mark));
    const getModel = await this.modelService.findModelByName(String(model));
    const getUnit = await this.unitService.findUnitByName(String(unit));

    const modifyData: Product = {
      ...bodyProduct,
      mark: getMark._id,
      model: getModel._id,
      unit: getUnit._id,
    };

    return await this.productModel.findByIdAndUpdate(id, modifyData, {
      new: true,
    });
  }

  async findProductByName(product: string): Promise<ProductDocument> {
    return await this.productModel.findOne({ name: product });
  }
}
