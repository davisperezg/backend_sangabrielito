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

  @Get('/nro/:id')
  getFactDetailss(@Param('id') fact: string) {
    return this.detailsService.findAll(fact);
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
}
