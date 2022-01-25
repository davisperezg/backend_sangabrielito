import { Module } from '@nestjs/common';
import { FactService } from './services/fact.service';
import { FactController } from './controllers/fact.controller';
import { FactSchema } from './schemas/fact.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { SequenceSchema } from 'src/sequence/schemas/sequence.schema';
import { SequenceService } from 'src/sequence/services/sequence.service';
import { AreaSchema } from 'src/area/schemas/area.schema';
import { AreaService } from 'src/area/services/area.service';
import { ClientSchema } from 'src/client/schemas/client.schema';
import { ClientService } from 'src/client/services/client.service';
import { Fact_DetailsSchema } from 'src/fact-details/schemas/fact-details.schema';
import { ProductSchema } from 'src/product/schemas/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Fact', schema: FactSchema },
      { name: 'Sequence', schema: SequenceSchema },
      { name: 'Area', schema: AreaSchema },
      { name: 'Client', schema: ClientSchema },
      { name: 'Fact_Details', schema: Fact_DetailsSchema },
      { name: 'Product', schema: ProductSchema },
    ]),
  ],
  providers: [FactService, SequenceService, AreaService, ClientService],
  controllers: [FactController],
})
export class FactModule {}
