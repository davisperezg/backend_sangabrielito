import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MarkService } from 'src/mark/services/mark.service';
import { ModelService } from 'src/model/services/model.service';
import { UnitMeasureService } from 'src/unit-measure/services/unit-measure.service';
import { Product, ProductDocument } from '../schemas/product.schema';

//let productsErrors: any[] = [];

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product') private productModel: Model<ProductDocument>,
    private readonly markService: MarkService,
    private readonly modelService: ModelService,
    private readonly unitService: UnitMeasureService,
  ) {}

  async findAll(user: any): Promise<Product[]> {
    return this.productModel
      .find({ status: true, area: user.area._id })
      .populate([
        {
          path: 'mark',
        },
        {
          path: 'model',
        },
        {
          path: 'unit',
        },
        {
          path: 'area',
        },
      ]);
  }

  async findAllDeleted(user: any): Promise<Product[]> {
    return this.productModel
      .find({ status: false, area: user.area._id })
      .populate([
        {
          path: 'mark',
        },
        {
          path: 'model',
        },
        {
          path: 'unit',
        },
        {
          path: 'area',
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

  async create(createProduct: Product, user: any): Promise<Product> {
    const { mark, model, unit, cod_internal, xmls }: any = createProduct;

    const idCodInterval = String(user.area._id).slice(-3).toUpperCase();

    const getMark = await this.markService.findMarkByName(String(mark));
    const getModel = await this.modelService.findModelByName(String(model));
    const getUnit = await this.unitService.findUnitByName(String(unit));

    if (xmls) {
      const findCod = await this.productModel.findOne({
        cod_internal: cod_internal,
      });
      const updateRenew = {
        ...createProduct,
        mark: getMark._id,
        model: getModel._id,
        unit: getUnit._id,
        area: user.area._id,
        status: true,
      };
      return await this.productModel.findByIdAndUpdate(
        findCod._id,
        updateRenew,
        {
          new: true,
        },
      );
    } else {
      const findCod = await this.productModel.findOne({
        cod_internal: idCodInterval + cod_internal,
      });
      if (findCod) {
        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            type: 'UNIQUE',
            message: 'El Cod. de barra y/o interno ya existe.',
          },
          HttpStatus.CONFLICT,
        );
      }
    }

    const modifyData: any = {
      ...createProduct,
      cod_internal: `${idCodInterval}${cod_internal}`,
      mark: getMark._id,
      model: getModel._id,
      unit: getUnit._id,
      area: user.area._id,
      status: true,
    };

    const createdProduct = new this.productModel(modifyData);
    return await createdProduct.save();
  }

  async update(id: string, bodyProduct: Product, user: any): Promise<Product> {
    const { mark, model, unit, status, cod_internal } = bodyProduct;
    const idCodInterval = String(user.area._id).slice(-3).toUpperCase();

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

    const findCod = await this.productModel.findOne({
      cod_internal: idCodInterval + cod_internal,
    });

    if (findCod && findCod._id.toString() !== id.toString()) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          type: 'UNIQUE',
          message: 'El Cod. de barra y/o interno ya existe.',
        },
        HttpStatus.CONFLICT,
      );
    }

    const findProductById = await this.productModel.findOne({ _id: id });

    if (
      findProductById &&
      findProductById.area.toString() !== user.area._id.toString()
    ) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          type: 'UNIQUE',
          message: 'Este producto pertenece a otra area y/o sede.',
        },
        HttpStatus.CONFLICT,
      );
    }

    const getMark = await this.markService.findMarkByName(String(mark));
    const getModel = await this.modelService.findModelByName(String(model));
    const getUnit = await this.unitService.findUnitByName(String(unit));

    const modifyData: Product = {
      ...bodyProduct,
      cod_internal: `${idCodInterval}${cod_internal}`,
      area: findProductById.area,
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

  async findProductById(product: string): Promise<ProductDocument> {
    return await this.productModel.findOne({ _id: product });
  }

  async findProductByIdAndUpdate(
    id: string,
    body: { stock: number },
  ): Promise<ProductDocument> {
    return await this.productModel.findByIdAndUpdate(id, body, {
      new: true,
    });
  }
}
