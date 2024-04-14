import { Test, TestingModule } from '@nestjs/testing';
import { FirewallController } from './firewall.controller';
import { FirewallService } from './firewall.service';

describe('FirewallController', () => {
  let controller: FirewallController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FirewallController],
      providers: [FirewallService],
    }).compile();

    controller = module.get<FirewallController>(FirewallController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
