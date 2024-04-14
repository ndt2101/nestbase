import { Test, TestingModule } from '@nestjs/testing';
import { LoadBalancerService } from './load-balancer.service';

describe('LoadBalancerService', () => {
  let service: LoadBalancerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoadBalancerService],
    }).compile();

    service = module.get<LoadBalancerService>(LoadBalancerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
