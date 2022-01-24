import { Module } from '@nestjs/common';
import { AreaService } from './services/area.service';
import { AreaController } from './controllers/area.controller';
import { AreaSchema } from './schemas/area.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Area', schema: AreaSchema }])],
  providers: [AreaService],
  controllers: [AreaController],
})
export class AreaModule {}
