import { Test, TestingModule } from '@nestjs/testing';
import { FileHandlerService } from './file-handler.service';
import { Mp3FrameCounterService } from '../mp3-frame-counter/mp3-frame-counter.service';
import { HashFileService } from '../hash-file/hash-file.service';
import { Mp3FrameHeaderValidatorService } from '../mp3-frame-header-validator/mp3-frame-header-validator.service';
import { instance, mock } from 'ts-mockito';
import { Repository } from 'typeorm';
import { File } from '../../entities/file.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('FileHandlerService', () => {
  let service: FileHandlerService;

  const mockFileRepositpory = mock(Repository<File>);

  beforeEach(async () => {
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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
