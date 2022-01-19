import { Test, TestingModule } from '@nestjs/testing';
import { FactDetailsService } from './fact-details.service';

describe('FactDetailsService', () => {
  let service: FactDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FactDetailsService],
    }).compile();

    service = module.get<FactDetailsService>(FactDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
