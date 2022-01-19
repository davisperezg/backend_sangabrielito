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

  async findAll(): Promise<Fact_Details[]> {
    return this.detailsModel.find({ status: true });
  }

  async findAllDeleted(): Promise<Fact_Details[]> {
    return this.detailsModel.find({ status: false });
  }

  async restore(id: string): Promise<boolean> {
    let result = false;

    try {
      await this.detailsModel.findByIdAndUpdate(id, { status: true });
      result = true;
    } catch (e) {
      //throw new Error(`Error en ProductService.deleteProductById ${e}`);
    }

    return result;
  }

  async delete(id: string): Promise<boolean> {
    let result = false;

    try {
      await this.detailsModel.findByIdAndUpdate(id, { status: false });
      result = true;
    } catch (e) {
      //throw new Error(`Error en ProductService.deleteProductById ${e}`);
    }

    return result;
  }

  async create(createFact_Details: Fact_Details): Promise<Fact_Details> {
    const { fact, product } = createFact_Details;

    const getFact = await this.factService.findFactByName(String(fact));
    const getProduct = await this.productService.findProductByName(
      String(product),
    );

    const modifyData: Fact_Details = {
      ...createFact_Details,
      fact: getFact._id,
      product: getProduct._id,
      status: true,
    };

    const createdModule = new this.detailsModel(modifyData);
    return createdModule.save();
  }

  async update(
    id: string,
    bodyFact_Details: Fact_Details,
  ): Promise<Fact_Details> {
    const { status, fact, product } = bodyFact_Details;

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

    const getFact = await this.factService.findFactByName(String(fact));
    const getProduct = await this.productService.findProductByName(
      String(product),
    );

    const modifyData: Fact_Details = {
      ...bodyFact_Details,
      fact: getFact._id,
      product: getProduct._id,
    };

    return await this.detailsModel.findByIdAndUpdate(id, modifyData, {
      new: true,
    });
  }

  async findFact_DetailsByName(details: string): Promise<Fact_DetailsDocument> {
    return await this.detailsModel.findOne({ name: details });
  }
}
