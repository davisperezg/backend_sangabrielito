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
import { Unit } from '../schemas/unit.schema';
import { UnitMeasureService } from '../services/unit-measure.service';

@Controller('api/v1/unit-measure')
export class UnitMeasureController {
  constructor(private readonly unitService: UnitMeasureService) {}

  @Get()
  getUnits() {
    return this.unitService.findAll();
  }

  @Get('/removes')
  getUnitsRemoves() {
    return this.unitService.findAllDeleted();
  }

  @Post()
  async createUnit(@Res() res, @Body() createBody: Unit): Promise<Unit> {
    const unit = await this.unitService.create(createBody);
    return res.status(HttpStatus.OK).json({
      message: 'Unit Successfully Created',
      unit,
    });
  }

  @Delete(':id')
  async deleteUnit(@Res() res, @Param('id') id: string): Promise<boolean> {
    const unitDeleted = await this.unitService.delete(id);
    return res.status(HttpStatus.OK).json({
      message: 'Unit Deleted Successfully',
      unitDeleted,
    });
  }

  @Put(':id')
  async updateUnit(
    @Res() res,
    @Param('id') id: string,
    @Body() createBody: Unit,
  ): Promise<Unit> {
    const unitUpdated = await this.unitService.update(id, createBody);
    return res.status(HttpStatus.OK).json({
      message: 'Unit Updated Successfully',
      unitUpdated,
    });
  }

  @Put('restore/:id')
  async restoreUnit(@Res() res, @Param('id') id: string): Promise<Unit> {
    const unitRestored = await this.unitService.restore(id);
    return res.status(HttpStatus.OK).json({
      message: 'Unit Restored Successfully',
      unitRestored,
    });
  }
}
