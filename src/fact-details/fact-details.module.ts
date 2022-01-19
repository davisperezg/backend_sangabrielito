import {
  Fact_DetailsSchema,
  Fact_Details,
} from './schemas/fact-details.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FactDetailsController } from './controllers/fact-details.controller';
import { Fact_DetailsDetailsService } from './services/fact-details.service';
import { ProductSchema } from 'src/product/schemas/product.schema';
import { FactSchema } from 'src/fact/schemas/fact.schema';
import { ProductService } from 'src/product/services/product.service';
import { FactService } from 'src/fact/services/fact.service';
import { MarkSchema } from 'src/mark/schemas/mark.schemas';
import { MarkService } from 'src/mark/services/mark.service';
import { MdelSchema } from 'src/model/schemas/model.schema';
import { ModelService } from 'src/model/services/model.service';
import { UnitMeasureService } from 'src/unit-measure/services/unit-measure.service';
import { UnitSchema } from 'src/unit-measure/schemas/unit.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Fact_Details.name, schema: Fact_DetailsSchema },
      { name: 'Product', schema: ProductSchema },
      { name: 'Fact', schema: FactSchema },
      { name: 'Mark', schema: MarkSchema },
      { name: 'Unit', schema: UnitSchema },
      { name: 'Mdel', schema: MdelSchema },
    ]),
  ],
  controllers: [FactDetailsController],
  providers: [
    Fact_DetailsDetailsService,
    ProductService,
    FactService,
    MarkService,
    UnitMeasureService,
    ModelService,
  ],
})
export class FactDetailsModule {}
