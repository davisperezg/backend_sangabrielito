import { Module } from '@nestjs/common';
import { MarkController } from './controllers/mark.controller';
import { MarkService } from './services/mark.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MarkSchema } from './schemas/mark.schemas';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Mark', schema: MarkSchema }])],
  controllers: [MarkController],
  providers: [MarkService],
})
export class MarkModule {}
