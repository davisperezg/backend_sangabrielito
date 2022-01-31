import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Fact_Details } from '../schemas/fact-details.schema';
import { Fact_DetailsDetailsService } from '../services/fact-details.service';
import { JwtAuthGuard } from 'src/lib/guards/auth.guard';
import { UserDocument } from 'src/user/schemas/user.schema';
import { CtxUser } from 'src/lib/decorators/ctx-user.decorators';

@Controller('api/v1/fact-details')
export class FactDetailsController {
  constructor(private readonly detailsService: Fact_DetailsDetailsService) {}

  @Get('/checking/:id')
  getDetailsByIdPublic(@Param('id') id: string) {
    return this.detailsService.findDetailsByIdFact(id);
  }

  @Get('/nro/:id')
  @UseGuards(JwtAuthGuard)
  getFactDetailss(@Param('id') fact: string) {
    return this.detailsService.findAll(fact);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createFactDetails(
    @Res() res,
    @Body() createBody: Fact_Details,
    @CtxUser() user: UserDocument,
  ): Promise<Fact_Details> {
    const details = await this.detailsService.create(createBody, user);
    return res.status(HttpStatus.OK).json({
      message: 'FactDetails Successfully Created',
      details,
    });
  }
}
