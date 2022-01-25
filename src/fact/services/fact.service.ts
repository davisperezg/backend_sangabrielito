import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClientService } from 'src/client/services/client.service';
import { SequenceService } from 'src/sequence/services/sequence.service';
import { Fact, FactDocument } from '../schemas/fact.schema';

@Injectable()
export class FactService {
  constructor(
    @InjectModel('Fact') private factModel: Model<FactDocument>,
    private readonly sequenceService: SequenceService,
    private readonly clientService: ClientService,
  ) {}

  async findAll(): Promise<Fact[]> {
    return this.factModel.find({ status: true }).populate([
      {
        path: 'client',
      },
      {
        path: 'user',
      },
    ]);
  }

  async findAllDeleted(): Promise<Fact[]> {
    return this.factModel.find({ status: false }).populate([
      {
        path: 'client',
      },
      {
        path: 'user',
      },
    ]);
  }

  async findByCodFact(fact: any): Promise<Fact> {
    return this.factModel.findOne({ fact: fact });
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

  async create(createFact: Fact, user: any): Promise<Fact> {
    const { cod_fact, client } = createFact;

    const findFact = await this.factModel.findOne({ cod_fact });

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
      cod_fact: getSequence.sequence,
      user: user._id,
      client: getClient._id,
      status: true,
    };

    //obtiene el ulti cod de fact y actualiza +1
    await this.sequenceService.getNextSequenceValue(getSequence._id);

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

  async findFactByCod(fact: number): Promise<FactDocument> {
    return await this.factModel.findOne({ cod_fact: fact });
  }
}
