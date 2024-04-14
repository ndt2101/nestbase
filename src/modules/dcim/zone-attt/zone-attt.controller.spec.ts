import { Test, TestingModule } from '@nestjs/testing';
import { ZoneAtttController } from './zone-attt.controller';

describe('ZoneAtttController', () => {
  let controller: ZoneAtttController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ZoneAtttController],
    }).compile();

    controller = module.get<ZoneAtttController>(ZoneAtttController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
