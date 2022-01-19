import { Module } from '@nestjs/common';
import { ProductController } from './controllers/product.controller';
import { ProductSchema } from './schemas/product.schema';
import { ProductService } from './services/product.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MdelSchema } from 'src/model/schemas/model.schema';
import { MarkSchema } from 'src/mark/schemas/mark.schemas';
import { UnitSchema } from 'src/unit-measure/schemas/unit.schema';
import { ModelService } from 'src/model/services/model.service';
import { MarkService } from 'src/mark/services/mark.service';
import { UnitMeasureService } from 'src/unit-measure/services/unit-measure.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Product', schema: ProductSchema },
      { name: 'Mdel', schema: MdelSchema },
      { name: 'Mark', schema: MarkSchema },
      { name: 'Unit', schema: UnitSchema },
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService, ModelService, MarkService, UnitMeasureService],
})
export class ProductModule {}
