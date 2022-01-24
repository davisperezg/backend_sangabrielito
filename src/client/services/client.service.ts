import {
  HttpException,
  HttpStatus,
  Injectable,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Client, ClientDocument } from '../schemas/client.schema';

@Injectable()
export class ClientService implements OnApplicationBootstrap {
  constructor(
    @InjectModel('Client') private clientModel: Model<ClientDocument>,
  ) {}

  async onApplicationBootstrap() {
    const count = await this.clientModel.estimatedDocumentCount();
    if (count > 0) return;
    try {
      await Promise.all([
        new this.clientModel({
          name: 'Cliente',
          lastname: 'no contado',
          status: true,
          tipDocument: 'DNI',
          nroDocument: '00000000',
        }).save(),
      ]);
    } catch (e) {
      throw new Error(`Error en ClientService.onModuleInit ${e}`);
    }
  }

  async findAll(): Promise<Client[]> {
    return this.clientModel.find({ status: true });
  }

  async findAllDeleted(): Promise<Client[]> {
    return this.clientModel.find({ status: false });
  }

  async restore(id: string): Promise<boolean> {
    let result = false;

    try {
      await this.clientModel.findByIdAndUpdate(id, { status: true });
      result = true;
    } catch (e) {
      //throw new Error(`Error en ProductService.deleteProductById ${e}`);
    }

    return result;
  }

  async delete(id: string): Promise<boolean> {
    let result = false;

    try {
      await this.clientModel.findByIdAndUpdate(id, { status: false });
      result = true;
    } catch (e) {
      //throw new Error(`Error en ProductService.deleteProductById ${e}`);
    }

    return result;
  }

  async create(createClient: Client): Promise<Client> {
    const { nroDocument } = createClient;

    const findNroDocument = await this.clientModel.findOne({ nroDocument });

    if (findNroDocument) {
      //No se puede crear el elemento
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          type: 'UNIQUE',
          message: 'El nro de documento ya existe.',
        },
        HttpStatus.CONFLICT,
      );
    }

    const modifyData: Client = {
      ...createClient,
      status: true,
    };

    const createdClient = new this.clientModel(modifyData);
    return createdClient.save();
  }

  async update(id: string, bodyClient: Client): Promise<Client> {
    const { status, nroDocument } = bodyClient;

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

    const findNroDocument = await this.clientModel.findOne({ nroDocument });

    if (findNroDocument && findNroDocument._id.toString() !== id.toString()) {
      //No se puede crear el elemento
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          type: 'UNIQUE',
          message: 'El nro de documento ya existe.',
        },
        HttpStatus.CONFLICT,
      );
    }

    return await this.clientModel.findByIdAndUpdate(id, bodyClient, {
      new: true,
    });
  }

  async findClientByNro(nro: string): Promise<ClientDocument> {
    return await this.clientModel.findOne({ nroDocument: nro });
  }
}
