import { UserDocument } from 'src/user/schemas/user.schema';
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
  UseGuards,
} from '@nestjs/common';
import { CtxUser } from 'src/lib/decorators/ctx-user.decorators';
import { JwtAuthGuard } from 'src/lib/guards/auth.guard';
import { Fact } from '../schemas/fact.schema';
import { FactService } from '../services/fact.service';

@UseGuards(JwtAuthGuard)
@Controller('api/v1/facts')
export class FactController {
  constructor(private readonly factService: FactService) {}

  @Get()
  getFacts(@CtxUser() user: UserDocument) {
    return this.factService.findAll(user);
  }

  @Get('/removes')
  getFactsRemoves(@CtxUser() user: UserDocument) {
    return this.factService.findAllDeleted(user);
  }

  @Post()
  async createFact(
    @Res() res,
    @Body() createBody: Fact,
    @CtxUser() user: UserDocument,
  ): Promise<Fact> {
    const fact = await this.factService.create(createBody, user);
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
}
