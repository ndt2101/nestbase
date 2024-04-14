import { Test, TestingModule } from '@nestjs/testing';
import { ZoneAtttService } from './zone-attt.service';

describe('ZoneAtttService', () => {
  let service: ZoneAtttService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ZoneAtttService],
    }).compile();

    service = module.get<ZoneAtttService>(ZoneAtttService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
