import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Client, ClientDocument } from '../schemas/client.schema';

@Injectable()
export class ClientService {
  constructor(
    @InjectModel('Client') private clientModel: Model<ClientDocument>,
  ) {}

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
    const { nroDocument, cellphone, email } = createClient;

    const findNroDocument = await this.clientModel.findOne({ nroDocument });
    const findCellphone = await this.clientModel.findOne({ cellphone });
    const findEmail = await this.clientModel.findOne({ email });

    if (findNroDocument) {
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

    if (findCellphone) {
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

    if (findEmail) {
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

    const modifyData: Client = {
      ...createClient,
      status: true,
    };

    const createdClient = new this.clientModel(modifyData);
    return createdClient.save();
  }

  async update(id: string, bodyClient: Client): Promise<Client> {
    const { status } = bodyClient;

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

    return await this.clientModel.findByIdAndUpdate(id, bodyClient, {
      new: true,
    });
  }
}
