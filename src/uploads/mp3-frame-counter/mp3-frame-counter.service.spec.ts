import { Test, TestingModule } from '@nestjs/testing';
import { Mp3FrameCounterService } from './mp3-frame-counter.service';

describe('Mp3FrameCounterService', () => {
  let service: Mp3FrameCounterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Mp3FrameCounterService],
    }).compile();

    service = module.get<Mp3FrameCounterService>(Mp3FrameCounterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
