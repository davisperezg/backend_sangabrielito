import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClientService } from 'src/client/services/client.service';
import { SequenceService } from 'src/sequence/services/sequence.service';
import { Fact, FactDocument } from '../schemas/fact.schema';
import { Fact_DetailsDocument } from 'src/fact-details/schemas/fact-details.schema';
import { ProductDocument } from 'src/product/schemas/product.schema';
import { startOfDay, add, endOfDay } from 'date-fns';

@Injectable()
export class FactService {
  constructor(
    @InjectModel('Fact') private factModel: Model<FactDocument>,
    private readonly sequenceService: SequenceService,
    private readonly clientService: ClientService,
    @InjectModel('Fact_Details')
    private detailsModel: Model<Fact_DetailsDocument>,
    @InjectModel('Product')
    private productModel: Model<ProductDocument>,
  ) {}

  async findAll(user: any): Promise<Fact[]> {
    const allFacts = await this.factModel.find({ status: true }).populate([
      {
        path: 'client',
      },
      {
        path: 'user',
      },
    ]);

    const justArea = allFacts.filter(
      (fact) => fact.user.area.toString() === user.area._id.toString(),
    );

    return justArea;
  }

  async findAllDeleted(user: any): Promise<Fact[]> {
    const allFacts = await this.factModel.find({ status: false }).populate([
      {
        path: 'client',
      },
      {
        path: 'user',
      },
    ]);

    const justArea = allFacts.filter(
      (fact) => fact.user.area.toString() === user.area._id.toString(),
    );

    return justArea;
  }

  async findStartAndEnd(start: string, end: string): Promise<Fact[]> {
    const ini = startOfDay(new Date(start));
    const addDayIni = add(ini, { days: 1 });

    const fin = endOfDay(new Date(end));
    const addDayEnd = add(fin, { days: 1 });

    return await this.factModel
      .find({
        status: true,
        createdAt: {
          $gte: addDayIni,
          $lt: addDayEnd,
        },
      })
      .populate([
        {
          path: 'client',
        },
        {
          path: 'user',
        },
      ]);
  }

  async delete(id: string | any): Promise<boolean> {
    let result = false;

    try {
      //busco los productos x id de la fact
      const findItemsByFact = await this.detailsModel.find({
        fact: id,
        status: true,
      });
      //recorro los productos de la fact y busco mis productos del inventario x id
      findItemsByFact.map(async (product) => {
        //obtengo mi stock actual x producto
        const myProduct = await this.productModel.findOne({
          _id: product.product,
        });
        //una vez que obtenga el stck actual, actualizo y sumo por lo que tenia en la fact
        await this.productModel.findByIdAndUpdate(
          product.product,
          { stock: myProduct.stock + product.quantity },
          { new: true },
        );
      });

      //anulo fact
      await this.factModel.findByIdAndUpdate(id, { status: false });
      result = true;
    } catch (e) {
      //throw new Error(`Error en ProductService.deleteProductById ${e}`);
    }

    return result;
  }

  async create(createFact: Fact, user: any): Promise<Fact> {
    const { cod_fact, client } = createFact;

    const idCodInterval = String(user.area._id).slice(-3).toUpperCase();
    const findFact = await this.factModel.findOne({
      cod_fact: idCodInterval + cod_fact,
    });

    if (findFact) {
      //No se puede crear el elemento
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          type: 'UNIQUE',
          message:
            'Ha ocurrido un error, ya existe una venta con el mismo código por favor intente actualizando la página.',
        },
        HttpStatus.CONFLICT,
      );
    }

    //obtiene el cliente
    const getClient = await this.clientService.findClientByNro(String(client));

    //obtene el cod actual de la fact
    const getSequence = await this.sequenceService.findSequenceByArea(
      user.area._id,
    );

    const modifyData: Fact = {
      ...createFact,
      cod_fact: idCodInterval + getSequence.sequence,
      user: user._id,
      client: getClient._id,
      status: true,
    };

    //obtiene el ulti cod de fact y actualiza +1
    await this.sequenceService.getNextSequenceValue(getSequence._id);

    const createdModule = new this.factModel(modifyData);

    return createdModule.save();
  }

  async findFactByCod(fact: string): Promise<FactDocument> {
    return await this.factModel.findOne({ cod_fact: fact });
  }

  async findFactById(id: string) {
    const fact: any = await this.factModel.findOne({ _id: id }).populate([
      {
        path: 'client',
      },
      {
        path: 'user',
        populate: {
          path: 'area',
        },
      },
    ]);

    let showData = {};

    if (fact.way_to_pay === 'EFECTIVO CON VUELTO') {
      showData = {
        cliente: fact.client.name + ' ' + fact.client.lastname,
        vendedor: fact.user.name + ' ' + fact.user.lastname,
        fecha_creada: fact.createdAt,
        cod_fact: fact.cod_fact,
        tipo_pago: fact.payment_type,
        forma_pago: fact.way_to_pay,
        total: fact.subtotal,
        descuento: fact.discount,
        pago_cliente: fact.customer_payment,
        area: fact.user.area.name,
        status: fact.status,
      };
    } else {
      showData = {
        cliente: fact.client.name + ' ' + fact.client.lastname,
        vendedor: fact.user.name + ' ' + fact.user.lastname,
        fecha_creada: fact.createdAt,
        cod_fact: fact.cod_fact,
        tipo_pago: fact.payment_type,
        forma_pago: fact.way_to_pay,
        total: fact.subtotal,
        area: fact.user.area.name,
        status: fact.status,
      };
    }

    return showData;
  }
}
