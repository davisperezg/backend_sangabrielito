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
import { Mark } from '../schemas/mark.schemas';
import { MarkService } from '../services/mark.service';

@UseGuards(JwtAuthGuard)
@Controller('api/v1/marks')
export class MarkController {
  constructor(private readonly markService: MarkService) {}

  @Get()
  getMarks() {
    return this.markService.findAll();
  }

  @Get('/removes')
  getMarksRemoves() {
    return this.markService.findAllDeleted();
  }

  @Post()
  async createMark(@Res() res, @Body() createBody: Mark): Promise<Mark> {
    const mark = await this.markService.create(createBody);
    return res.status(HttpStatus.OK).json({
      message: 'Mark Successfully Created',
      mark,
    });
  }

  @Delete(':id')
  async deleteMark(@Res() res, @Param('id') id: string): Promise<boolean> {
    const markDeleted = await this.markService.delete(id);
    return res.status(HttpStatus.OK).json({
      message: 'Mark Deleted Successfully',
      markDeleted,
    });
  }

  @Put(':id')
  async updateMark(
    @Res() res,
    @Param('id') id: string,
    @Body() createBody: Mark,
  ): Promise<Mark> {
    const markUpdated = await this.markService.update(id, createBody);
    return res.status(HttpStatus.OK).json({
      message: 'Mark Updated Successfully',
      markUpdated,
    });
  }

  @Put('restore/:id')
  async restoreMark(@Res() res, @Param('id') id: string): Promise<Mark> {
    const markRestored = await this.markService.restore(id);
    return res.status(HttpStatus.OK).json({
      message: 'Mark Restored Successfully',
      markRestored,
    });
  }
}
