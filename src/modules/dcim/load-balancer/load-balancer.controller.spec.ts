import { Test, TestingModule } from '@nestjs/testing';
import { LoadBalancerController } from './load-balancer.controller';
import { LoadBalancerService } from './load-balancer.service';

describe('LoadBalancerController', () => {
  let controller: LoadBalancerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoadBalancerController],
      providers: [LoadBalancerService],
    }).compile();

    controller = module.get<LoadBalancerController>(LoadBalancerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
