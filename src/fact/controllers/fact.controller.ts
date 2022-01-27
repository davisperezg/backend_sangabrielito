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

@Controller('api/v1/facts')
export class FactController {
  constructor(private readonly factService: FactService) {}

  @Get('/checking/:id')
  getFactByIdPublic(@Param('id') id: string) {
    return this.factService.findFactById(id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getFacts(@CtxUser() user: UserDocument) {
    return this.factService.findAll(user);
  }

  @Get('/consult/range/:start/:end')
  @UseGuards(JwtAuthGuard)
  getFactStartAndEnd(@Param('start') start: string, @Param('end') end: string) {
    return this.factService.findStartAndEnd(start, end);
  }

  @Get('/removes')
  @UseGuards(JwtAuthGuard)
  getFactsRemoves(@CtxUser() user: UserDocument) {
    return this.factService.findAllDeleted(user);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  async deleteFact(@Res() res, @Param('id') id: string): Promise<boolean> {
    const factDeleted = await this.factService.delete(id);
    return res.status(HttpStatus.OK).json({
      message: 'Fact Deleted Successfully',
      factDeleted,
    });
  }
}
