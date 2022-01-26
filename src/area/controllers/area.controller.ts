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
import { JwtAuthGuard } from 'src/lib/guards/auth.guard';
import { Area } from '../schemas/area.schema';
import { AreaService } from '../services/area.service';

@Controller('api/v1/areas')
@UseGuards(JwtAuthGuard)
export class AreaController {
  constructor(private readonly areaService: AreaService) {}

  @Get()
  getAreas() {
    return this.areaService.findAll();
  }

  @Get('/removes')
  getAreasRemoves() {
    return this.areaService.findAllDeleted();
  }

  @Post()
  async createArea(@Res() res, @Body() createBody: Area): Promise<Area> {
    const area = await this.areaService.create(createBody);
    return res.status(HttpStatus.OK).json({
      message: 'Area Successfully Created',
      area,
    });
  }

  @Delete(':id')
  async deleteArea(@Res() res, @Param('id') id: string): Promise<boolean> {
    const areaDeleted = await this.areaService.delete(id);
    return res.status(HttpStatus.OK).json({
      message: 'Area Deleted Successfully',
      areaDeleted,
    });
  }

  @Put(':id')
  async updateArea(
    @Res() res,
    @Param('id') id: string,
    @Body() createBody: Area,
  ): Promise<Area> {
    const areaUpdated = await this.areaService.update(id, createBody);
    return res.status(HttpStatus.OK).json({
      message: 'Area Updated Successfully',
      areaUpdated,
    });
  }

  @Put('restore/:id')
  async restoreArea(@Res() res, @Param('id') id: string): Promise<Area> {
    const areaRestored = await this.areaService.restore(id);
    return res.status(HttpStatus.OK).json({
      message: 'Area Restored Successfully',
      areaRestored,
    });
  }
}
