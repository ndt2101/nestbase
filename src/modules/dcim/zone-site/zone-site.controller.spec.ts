import { Test, TestingModule } from '@nestjs/testing';
import { ZoneSiteController } from './zone-site.controller';

describe('ZoneSiteController', () => {
  let controller: ZoneSiteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ZoneSiteController],
    }).compile();

    controller = module.get<ZoneSiteController>(ZoneSiteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
