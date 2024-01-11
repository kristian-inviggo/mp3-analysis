import { Test, TestingModule } from '@nestjs/testing';
import { FileHandlerService } from './file-handler.service';
import { Mp3FrameCounterService } from '../mp3-frame-counter/mp3-frame-counter.service';
import { readFileSync } from 'fs';
import { CacheService } from '../../../shared/cache/cache.service';
import { CacheModule } from '@nestjs/cache-manager';
import { HashFileService } from '../hash-file/hash-file.service';

function readFile(fileName: string): Buffer {
  return readFileSync(`test/fixtures/${fileName}`);
}

describe('FileHandlerService', () => {
  let service: FileHandlerService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      providers: [
        FileHandlerService,
        Mp3FrameCounterService,
        HashFileService,
        CacheService,
      ],
    }).compile();

    service = module.get<FileHandlerService>(FileHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getMp3FileFrameCount', () => {
    const validFile = readFile('sample.mp3');

    it('should return the valid frame number for the mp3 file', async () => {
      const result = await service.getMp3FileFrameCount(validFile);
      expect(result).toEqual(1610);
    });
  });
});
