import { Test, TestingModule } from '@nestjs/testing';
import { InfrastructureTypeController } from './infrastructure-type.controller';

describe('InfrastructureTypeController', () => {
  let controller: InfrastructureTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InfrastructureTypeController],
    }).compile();

    controller = module.get<InfrastructureTypeController>(InfrastructureTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
