import { AreaDocument } from './../../area/schemas/area.schema';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { Sequence } from '../schemas/sequence.schema';
import { SequenceService } from '../services/sequence.service';

@Controller('api/v1/sequences')
export class SequenceController {
  constructor(private readonly sequenceService: SequenceService) {}

  @Get()
  getSequences() {
    return this.sequenceService.findAll();
  }

  @Get('/area/:id')
  getSequenceByArea(@Param('id') id: string) {
    return this.sequenceService.findSequenceByArea(id);
  }

  @Post()
  async createSequence(
    @Res() res,
    @Body() createBody: Sequence,
  ): Promise<Sequence> {
    const sequence = await this.sequenceService.create(createBody);
    return res.status(HttpStatus.OK).json({
      message: 'Sequence Successfully Created',
      sequence,
    });
  }

  @Put(':id')
  async updateSequence(
    @Res() res,
    @Param('id') id: string,
    @Body() createBody: Sequence,
  ): Promise<Sequence> {
    const sequenceUpdated = await this.sequenceService.update(id, createBody);
    return res.status(HttpStatus.OK).json({
      message: 'Sequence Updated Successfully',
      sequenceUpdated,
    });
  }
}
