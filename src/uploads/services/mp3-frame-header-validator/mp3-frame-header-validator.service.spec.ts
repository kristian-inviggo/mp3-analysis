import { Test, TestingModule } from '@nestjs/testing';
import { Mp3FrameHeaderValidatorService } from './mp3-frame-header-validator.service';

describe('Mp3FrameHeaderValidatorService', () => {
  let service: Mp3FrameHeaderValidatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Mp3FrameHeaderValidatorService],
    }).compile();

    service = module.get<Mp3FrameHeaderValidatorService>(Mp3FrameHeaderValidatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
