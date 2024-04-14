import { Test, TestingModule } from '@nestjs/testing';
import { DeparmentController } from './deparment.controller';

describe('DeparmentController', () => {
  let controller: DeparmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeparmentController],
    }).compile();

    controller = module.get<DeparmentController>(DeparmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
