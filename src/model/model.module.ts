import { Module } from '@nestjs/common';
import { ModelController } from './controllers/model.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ModelService } from './services/model.service';
import { ModelESchema } from './schemas/model.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'ModelE', schema: ModelESchema }]),
  ],
  controllers: [ModelController],
  providers: [ModelService],
})
export class ModelModule {}
