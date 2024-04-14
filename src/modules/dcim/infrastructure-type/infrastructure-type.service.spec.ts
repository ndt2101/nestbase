import { Test, TestingModule } from '@nestjs/testing';
import { InfrastructureTypeService } from './infrastructure-type.service';

describe('InfrastructureTypeService', () => {
  let service: InfrastructureTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InfrastructureTypeService],
    }).compile();

    service = module.get<InfrastructureTypeService>(InfrastructureTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
