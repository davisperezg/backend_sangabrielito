import { Test, TestingModule } from '@nestjs/testing';
import { FactDetailsController } from './fact-details.controller';

describe('FactDetailsController', () => {
  let controller: FactDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FactDetailsController],
    }).compile();

    controller = module.get<FactDetailsController>(FactDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
