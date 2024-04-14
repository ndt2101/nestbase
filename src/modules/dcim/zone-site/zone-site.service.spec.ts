import { Test, TestingModule } from '@nestjs/testing';
import { ZoneSiteService } from './zone-site.service';

describe('ZoneSiteService', () => {
  let service: ZoneSiteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ZoneSiteService],
    }).compile();

    service = module.get<ZoneSiteService>(ZoneSiteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
