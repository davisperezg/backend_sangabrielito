import { CtxUser } from 'src/lib/decorators/ctx-user.decorators';
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
import { Product } from '../schemas/product.schema';
import { ProductService } from '../services/product.service';
import { UserDocument } from 'src/user/schemas/user.schema';

@UseGuards(JwtAuthGuard)
@Controller('api/v1/products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  getProducts(@CtxUser() user: UserDocument) {
    return this.productService.findAll(user);
  }

  @Get('/removes')
  getProductsRemoves(@CtxUser() user: UserDocument) {
    return this.productService.findAllDeleted(user);
  }

  @Post()
  async createProduct(
    @Res() res,
    @Body() createBody: Product,
    @CtxUser() user: UserDocument,
  ): Promise<Product> {
    const product = await this.productService.create(createBody, user);
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
    @CtxUser() user: UserDocument,
  ): Promise<Product> {
    const productUpdated = await this.productService.update(
      id,
      createBody,
      user,
    );
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
