import { FactService } from './../../fact/services/fact.service';
import { ProductService } from './../../product/services/product.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Fact_Details,
  Fact_DetailsDocument,
} from '../schemas/fact-details.schema';

@Injectable()
export class Fact_DetailsDetailsService {
  constructor(
    @InjectModel('Fact_Details')
    private detailsModel: Model<Fact_DetailsDocument>,
    private readonly productService: ProductService,
    private readonly factService: FactService,
  ) {}

  async findAll(fact: any): Promise<Fact_Details[]> {
    return this.detailsModel.find({ fact: fact, status: true }).populate([
      {
        path: 'product',
        populate: [
          {
            path: 'unit',
          },
        ],
      },
      { path: 'fact' },
    ]);
  }

  async create(
    createFact_Details: Fact_Details,
    user: any,
  ): Promise<Fact_Details | boolean> {
    const { fact, product } = createFact_Details;

    const idCodInterval = String(user.area._id).slice(-3).toUpperCase();
    const getFact = await this.factService.findFactByCod(
      String(idCodInterval + fact),
    );

    const modifyData: Fact_Details = {
      ...createFact_Details,
      fact: getFact._id,
      product: product,
      status: true,
    };

    const findProduct = await this.productService.findProductById(
      String(product),
    );

    const stock = findProduct.stock;
    const quantity = modifyData.quantity;
    const updateStock = stock - quantity;

    if (updateStock < 0) {
      return await this.factService.delete(getFact._id);
      // throw new HttpException(
      //   {
      //     status: HttpStatus.BAD_REQUEST,
      //     type: 'ERROR',
      //     message:
      //       'El producto ingresado no tiene stock. Por favor incremente en el inventario',
      //   },
      //   HttpStatus.BAD_REQUEST,
      // );
    }

    this.productService.findProductByIdAndUpdate(String(product), {
      stock: updateStock,
    });

    const createdModule = new this.detailsModel(modifyData);
    return createdModule.save();
  }

  async findDetailsByIdFact(id: any) {
    const details = await this.detailsModel
      .find({ fact: { $in: id } })
      .populate({
        path: 'product',
        populate: {
          path: 'unit',
        },
      });

    const showDetails = details.map((detls) => {
      return {
        producto: detls.product.name + ' - ' + detls.product.unit.name,
        precio: detls.price,
        descuento: detls.discount,
        cantidad: detls.quantity,
      };
    });

    return showDetails;
  }
}
