import { Test, TestingModule } from '@nestjs/testing';
import { UnitMeasureController } from './unit-measure.controller';

describe('UnitMeasureController', () => {
  let controller: UnitMeasureController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UnitMeasureController],
    }).compile();

    controller = module.get<UnitMeasureController>(UnitMeasureController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
