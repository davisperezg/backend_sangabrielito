import { Module } from '@nestjs/common';
import { ModelController } from './controllers/model.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ModelService } from './services/model.service';
import { MdelSchema } from './schemas/model.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Mdel', schema: MdelSchema }])],
  controllers: [ModelController],
  providers: [ModelService],
})
export class ModelModule {}
