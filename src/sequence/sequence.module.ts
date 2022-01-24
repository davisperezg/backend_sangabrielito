import { SequenceSchema } from './schemas/sequence.schema';
import { Module } from '@nestjs/common';
import { SequenceService } from './services/sequence.service';
import { SequenceController } from './controllers/sequence.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AreaSchema } from 'src/area/schemas/area.schema';
import { AreaService } from 'src/area/services/area.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Sequence', schema: SequenceSchema },
      { name: 'Area', schema: AreaSchema },
    ]),
  ],
  providers: [SequenceService, AreaService],
  controllers: [SequenceController],
})
export class SequenceModule {}
