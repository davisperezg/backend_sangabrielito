import { InjectModel } from '@nestjs/mongoose';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Sequence, SequenceDocument } from '../schemas/sequence.schema';
import { AreaService } from 'src/area/services/area.service';
import { FactService } from 'src/fact/services/fact.service';
import { FactDocument } from 'src/fact/schemas/fact.schema';

@Injectable()
export class SequenceService {
  constructor(
    @InjectModel('Sequence') private sequenceModel: Model<SequenceDocument>,
    private readonly areaService: AreaService,
    @InjectModel('Fact') private factModel: Model<FactDocument>,
  ) {}

  // async onModuleInit() {
  //   const count = await this.sequenceModel.estimatedDocumentCount();
  //   if (count > 0) return;

  //   try {
  //     await Promise.all([
  //       new this.sequenceModel({
  //         sequence: 0,
  //       }).save(),
  //     ]);
  //   } catch (e) {
  //     throw new Error(`Error en SequenceService.onModuleInit ${e}`);
  //   }
  // }

  async findAll(): Promise<SequenceDocument[]> {
    return this.sequenceModel.find().populate({
      path: 'area',
    });
  }

  async create(createSequence: Sequence): Promise<Sequence> {
    const { area } = createSequence;

    const getArea = await this.areaService.findAreaByName(String(area));
    const findDataSequences = await this.sequenceModel.findOne({
      area: getArea._id,
    });

    if (findDataSequences) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          type: 'UNIQUE',
          message: 'Ya existe una secuencia relacionada con el area.',
        },
        HttpStatus.CONFLICT,
      );
    }

    const modifyData: Sequence = {
      ...createSequence,
      area: getArea._id,
    };

    const createdSequence = new this.sequenceModel(modifyData);
    return createdSequence.save();
  }

  async update(id: string, bodySequence: Sequence): Promise<Sequence> {
    const { area, sequence } = bodySequence;

    const findCodInFacts = await this.factModel.find().populate([
      {
        path: 'client',
      },
      {
        path: 'user',
        populate: { path: 'area' },
      },
    ]);
    const findCodFactsByArea = findCodInFacts
      .filter((fin: any) => fin.user.area.name === area.toString())
      .find((one: any) =>
        Number(sequence) <= Number(one.cod_fact) ? true : false,
      );

    if (findCodFactsByArea) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          type: 'UNIQUE',
          message:
            'La secuencia no puede ser igual al de una venta que ya existe. Por favor use su secuencia actual o cambiela a una mayor.',
        },
        HttpStatus.CONFLICT,
      );
    }

    const findMyData = await this.sequenceModel.findOne({ _id: id });
    const getArea = await this.areaService.findAreaByName(String(area));

    if (getArea && getArea._id.toString() !== findMyData.area.toString()) {
      //Si rol no existe
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          type: 'UNIQUE',
          message: 'Ya existe una secuencia relacionada con el area.',
        },
        HttpStatus.CONFLICT,
      );
    }

    const modifyData: Sequence = {
      ...bodySequence,
      area: getArea._id,
    };

    return await this.sequenceModel.findByIdAndUpdate(id, modifyData, {
      new: true,
    });
  }

  async getNextSequenceValue(id: string) {
    return await this.sequenceModel.findByIdAndUpdate(
      id,
      {
        $inc: { sequence: 1 },
      },
      { new: true },
    );
  }

  async findSequenceByArea(area: any): Promise<SequenceDocument> {
    return await this.sequenceModel.findOne({ area: area });
  }
}
