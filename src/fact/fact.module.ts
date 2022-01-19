import { Module } from '@nestjs/common';
import { FactService } from './services/fact.service';
import { FactController } from './controllers/fact.controller';
import { FactSchema } from './schemas/fact.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Fact', schema: FactSchema }])],
  providers: [FactService],
  controllers: [FactController],
})
export class FactModule {}
