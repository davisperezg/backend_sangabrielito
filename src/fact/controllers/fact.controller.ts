import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { Fact } from '../schemas/fact.schema';
import { FactService } from '../services/fact.service';

@Controller('api/v1/facts')
export class FactController {
  constructor(private readonly factService: FactService) {}

  @Get()
  getFacts() {
    return this.factService.findAll();
  }

  @Get('/removes')
  getFactsRemoves() {
    return this.factService.findAllDeleted();
  }

  @Post()
  async createFact(@Res() res, @Body() createBody: Fact): Promise<Fact> {
    const fact = await this.factService.create(createBody);
    return res.status(HttpStatus.OK).json({
      message: 'Fact Successfully Created',
      fact,
    });
  }

  @Delete(':id')
  async deleteFact(@Res() res, @Param('id') id: string): Promise<boolean> {
    const factDeleted = await this.factService.delete(id);
    return res.status(HttpStatus.OK).json({
      message: 'Fact Deleted Successfully',
      factDeleted,
    });
  }

  @Put(':id')
  async updateFact(
    @Res() res,
    @Param('id') id: string,
    @Body() createBody: Fact,
  ): Promise<Fact> {
    const factUpdated = await this.factService.update(id, createBody);
    return res.status(HttpStatus.OK).json({
      message: 'Fact Updated Successfully',
      factUpdated,
    });
  }

  @Put('restore/:id')
  async restoreFact(@Res() res, @Param('id') id: string): Promise<Fact> {
    const factRestored = await this.factService.restore(id);
    return res.status(HttpStatus.OK).json({
      message: 'Fact Restored Successfully',
      factRestored,
    });
  }
}
