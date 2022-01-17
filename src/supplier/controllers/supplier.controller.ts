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
import { Supplier } from '../schemas/supplier.schema';
import { SupplierService } from '../services/supplier.service';

@Controller('api/v1/suppliers')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Get()
  getSuppliers() {
    return this.supplierService.findAll();
  }

  @Get('/removes')
  getSuppliersRemoves() {
    return this.supplierService.findAllDeleted();
  }

  @Post()
  async createSupplier(
    @Res() res,
    @Body() createBody: Supplier,
  ): Promise<Supplier> {
    const supplier = await this.supplierService.create(createBody);
    return res.status(HttpStatus.OK).json({
      message: 'Supplier Successfully Created',
      supplier,
    });
  }

  @Delete(':id')
  async deleteSupplier(@Res() res, @Param('id') id: string): Promise<boolean> {
    const supplierDeleted = await this.supplierService.delete(id);
    return res.status(HttpStatus.OK).json({
      message: 'Supplier Deleted Successfully',
      supplierDeleted,
    });
  }

  @Put(':id')
  async updateSupplier(
    @Res() res,
    @Param('id') id: string,
    @Body() createBody: Supplier,
  ): Promise<Supplier> {
    const supplierUpdated = await this.supplierService.update(id, createBody);
    return res.status(HttpStatus.OK).json({
      message: 'Supplier Updated Successfully',
      supplierUpdated,
    });
  }

  @Put('restore/:id')
  async restoreSupplier(
    @Res() res,
    @Param('id') id: string,
  ): Promise<Supplier> {
    const supplierRestored = await this.supplierService.restore(id);
    return res.status(HttpStatus.OK).json({
      message: 'Supplier Restored Successfully',
      supplierRestored,
    });
  }
}
