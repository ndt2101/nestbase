import { Test, TestingModule } from '@nestjs/testing';
import { VlanService } from './vlan.service';

describe('VlanService', () => {
  let service: VlanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VlanService],
    }).compile();

    service = module.get<VlanService>(VlanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
