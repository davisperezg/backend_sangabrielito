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
import { ModelE } from '../schemas/model.schema';
import { ModelService } from '../services/model.service';

@Controller('api/v1/models')
export class ModelController {
  constructor(private readonly modelService: ModelService) {}

  @Get()
  getModelEs() {
    return this.modelService.findAll();
  }

  @Get('/removes')
  getModelEsRemoves() {
    return this.modelService.findAllDeleted();
  }

  @Post()
  async createModelE(@Res() res, @Body() createBody: ModelE): Promise<ModelE> {
    const model = await this.modelService.create(createBody);
    return res.status(HttpStatus.OK).json({
      message: 'ModelE Successfully Created',
      model,
    });
  }

  @Delete(':id')
  async deleteModelE(@Res() res, @Param('id') id: string): Promise<boolean> {
    const modelDeleted = await this.modelService.delete(id);
    return res.status(HttpStatus.OK).json({
      message: 'ModelE Deleted Successfully',
      modelDeleted,
    });
  }

  @Put(':id')
  async updateModelE(
    @Res() res,
    @Param('id') id: string,
    @Body() createBody: ModelE,
  ): Promise<ModelE> {
    const modelUpdated = await this.modelService.update(id, createBody);
    return res.status(HttpStatus.OK).json({
      message: 'ModelE Updated Successfully',
      modelUpdated,
    });
  }

  @Put('restore/:id')
  async restoreModelE(@Res() res, @Param('id') id: string): Promise<ModelE> {
    const modelRestored = await this.modelService.restore(id);
    return res.status(HttpStatus.OK).json({
      message: 'ModelE Restored Successfully',
      modelRestored,
    });
  }
}
