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
import { Product } from '../schemas/product.schema';
import { ProductService } from '../services/product.service';

@Controller('api/v1/products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  getProducts() {
    return this.productService.findAll();
  }

  @Get('/removes')
  getProductsRemoves() {
    return this.productService.findAllDeleted();
  }

  @Post()
  async createProduct(
    @Res() res,
    @Body() createBody: Product,
  ): Promise<Product> {
    const product = await this.productService.create(createBody);
    return res.status(HttpStatus.OK).json({
      message: 'Product Successfully Created',
      product,
    });
  }

  @Delete(':id')
  async deleteProduct(@Res() res, @Param('id') id: string): Promise<boolean> {
    const productDeleted = await this.productService.delete(id);
    return res.status(HttpStatus.OK).json({
      message: 'Product Deleted Successfully',
      productDeleted,
    });
  }

  @Put(':id')
  async updateProduct(
    @Res() res,
    @Param('id') id: string,
    @Body() createBody: Product,
  ): Promise<Product> {
    const productUpdated = await this.productService.update(id, createBody);
    return res.status(HttpStatus.OK).json({
      message: 'Product Updated Successfully',
      productUpdated,
    });
  }

  @Put('restore/:id')
  async restoreProduct(@Res() res, @Param('id') id: string): Promise<Product> {
    const productRestored = await this.productService.restore(id);
    return res.status(HttpStatus.OK).json({
      message: 'Product Restored Successfully',
      productRestored,
    });
  }
}
