import { Test, TestingModule } from '@nestjs/testing';
import { FileHandlerService } from './file-handler.service';
import { Mp3FrameCounterService } from '../mp3-frame-counter/mp3-frame-counter.service';
import { HashFileService } from '../hash-file/hash-file.service';
import { Mp3FrameHeaderValidatorService } from '../mp3-frame-header-validator/mp3-frame-header-validator.service';
import { anything, instance, mock, resetCalls, verify, when } from 'ts-mockito';
import { Repository } from 'typeorm';
import { File } from '../../entities/file.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { readFileSync } from 'fs';

function readFile(fileName: string): Buffer {
  return readFileSync(`test/fixtures/${fileName}`);
}

describe('FileHandlerService', () => {
  let service: FileHandlerService;

  const mockFileRepositpory = mock(Repository<File>);

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileHandlerService,
        Mp3FrameCounterService,
        HashFileService,
        Mp3FrameHeaderValidatorService,
        {
          provide: getRepositoryToken(File),
          useValue: instance(mockFileRepositpory),
        },
      ],
    }).compile();

    service = module.get<FileHandlerService>(FileHandlerService);
  });

  beforeEach(() => {
    resetCalls(mockFileRepositpory);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateAndGetMp3FileFrames', () => {
    const validFile = readFile('sample.mp3');

    it('should verify that the save method was invoked for saving a file when there is no file with that hash in the database', async () => {
      when(mockFileRepositpory.findOneBy(anything())).thenResolve(null);

      const result = await service.validateAndGetMp3FileFrames(validFile);

      expect(result).toEqual(1792);
      verify(mockFileRepositpory.save(anything())).once();
    });

    it("should not insert the new frameCount to the database if there is an entry for the file's hash", async () => {
      when(mockFileRepositpory.findOneBy(anything())).thenResolve({
        id: 'some id',
        frameCount: 500,
      });

      const result = await service.validateAndGetMp3FileFrames(validFile);

      expect(result).toEqual(500);
      verify(mockFileRepositpory.save(anything())).never();
    });
  });
});
