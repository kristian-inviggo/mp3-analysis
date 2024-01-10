import { Test, TestingModule } from '@nestjs/testing';
import { HashFileService } from './hash-file.service';

describe('HashFileService', () => {
  let service: HashFileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HashFileService],
    }).compile();

    service = module.get<HashFileService>(HashFileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
