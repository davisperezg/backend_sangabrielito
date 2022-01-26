import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Sequence } from '../schemas/sequence.schema';
import { SequenceService } from '../services/sequence.service';
import { JwtAuthGuard } from 'src/lib/guards/auth.guard';

@UseGuards(JwtAuthGuard)
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
