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
import { Mdel } from '../schemas/model.schema';
import { ModelService } from '../services/model.service';

@Controller('api/v1/models')
export class ModelController {
  constructor(private readonly modelService: ModelService) {}

  @Get()
  getMdels() {
    return this.modelService.findAll();
  }

  @Get('/removes')
  getMdelsRemoves() {
    return this.modelService.findAllDeleted();
  }

  @Post()
  async createMdel(@Res() res, @Body() createBody: Mdel): Promise<Mdel> {
    const model = await this.modelService.create(createBody);
    return res.status(HttpStatus.OK).json({
      message: 'Mdel Successfully Created',
      model,
    });
  }

  @Delete(':id')
  async deleteMdel(@Res() res, @Param('id') id: string): Promise<boolean> {
    const modelDeleted = await this.modelService.delete(id);
    return res.status(HttpStatus.OK).json({
      message: 'Mdel Deleted Successfully',
      modelDeleted,
    });
  }

  @Put(':id')
  async updateMdel(
    @Res() res,
    @Param('id') id: string,
    @Body() createBody: Mdel,
  ): Promise<Mdel> {
    const modelUpdated = await this.modelService.update(id, createBody);
    return res.status(HttpStatus.OK).json({
      message: 'Mdel Updated Successfully',
      modelUpdated,
    });
  }

  @Put('restore/:id')
  async restoreMdel(@Res() res, @Param('id') id: string): Promise<Mdel> {
    const modelRestored = await this.modelService.restore(id);
    return res.status(HttpStatus.OK).json({
      message: 'Mdel Restored Successfully',
      modelRestored,
    });
  }
}
