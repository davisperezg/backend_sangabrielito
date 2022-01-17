import { Module } from '@nestjs/common';
import { UnitMeasureService } from './services/unit-measure.service';
import { UnitMeasureController } from './controllers/unit-measure.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UnitSchema } from './schemas/unit.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Unit', schema: UnitSchema }])],

  providers: [UnitMeasureService],
  controllers: [UnitMeasureController],
})
export class UnitMeasureModule {}
