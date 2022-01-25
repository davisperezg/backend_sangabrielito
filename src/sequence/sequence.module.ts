import { SequenceSchema } from './schemas/sequence.schema';
import { Module } from '@nestjs/common';
import { SequenceService } from './services/sequence.service';
import { SequenceController } from './controllers/sequence.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AreaSchema } from 'src/area/schemas/area.schema';
import { AreaService } from 'src/area/services/area.service';
import { FactSchema } from 'src/fact/schemas/fact.schema';
import { FactService } from 'src/fact/services/fact.service';
import { ClientService } from 'src/client/services/client.service';
import { ClientSchema } from 'src/client/schemas/client.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Sequence', schema: SequenceSchema },
      { name: 'Area', schema: AreaSchema },
      { name: 'Client', schema: ClientSchema },
      { name: 'Fact', schema: FactSchema },
    ]),
  ],
  providers: [SequenceService, AreaService, FactService, ClientService],
  controllers: [SequenceController],
})
export class SequenceModule {}
