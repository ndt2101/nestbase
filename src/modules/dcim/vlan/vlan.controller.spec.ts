import { Test, TestingModule } from '@nestjs/testing';
import { VlanController } from './vlan.controller';

describe('VlanController', () => {
  let controller: VlanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VlanController],
    }).compile();

    controller = module.get<VlanController>(VlanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
