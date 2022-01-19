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
import { Fact_Details } from '../schemas/fact-details.schema';
import { Fact_DetailsDetailsService } from '../services/fact-details.service';

@Controller('api/v1/fact-details')
export class FactDetailsController {
  constructor(private readonly detailsService: Fact_DetailsDetailsService) {}

  @Get()
  getFactDetailss() {
    return this.detailsService.findAll();
  }

  @Get('/removes')
  getFactDetailssRemoves() {
    return this.detailsService.findAllDeleted();
  }

  @Post()
  async createFactDetails(
    @Res() res,
    @Body() createBody: Fact_Details,
  ): Promise<Fact_Details> {
    const details = await this.detailsService.create(createBody);
    return res.status(HttpStatus.OK).json({
      message: 'FactDetails Successfully Created',
      details,
    });
  }

  @Delete(':id')
  async deleteFactDetails(
    @Res() res,
    @Param('id') id: string,
  ): Promise<boolean> {
    const detailsDeleted = await this.detailsService.delete(id);
    return res.status(HttpStatus.OK).json({
      message: 'FactDetails Deleted Successfully',
      detailsDeleted,
    });
  }

  @Put(':id')
  async updateFactDetails(
    @Res() res,
    @Param('id') id: string,
    @Body() createBody: Fact_Details,
  ): Promise<Fact_Details> {
    const detailsUpdated = await this.detailsService.update(id, createBody);
    return res.status(HttpStatus.OK).json({
      message: 'FactDetails Updated Successfully',
      detailsUpdated,
    });
  }

  @Put('restore/:id')
  async restoreFactDetails(
    @Res() res,
    @Param('id') id: string,
  ): Promise<Fact_Details> {
    const detailsRestored = await this.detailsService.restore(id);
    return res.status(HttpStatus.OK).json({
      message: 'FactDetails Restored Successfully',
      detailsRestored,
    });
  }
}
