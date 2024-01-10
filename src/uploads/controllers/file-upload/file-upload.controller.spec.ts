import { Test, TestingModule } from '@nestjs/testing';
import { FileUploadController } from './file-upload.controller';
import { FileHandlerService } from '../../services/file-handler/file-handler.service';
import { Mp3FrameCounterService } from '../../services/mp3-frame-counter/mp3-frame-counter.service';
import { HashFileService } from '../../services/hash-file/hash-file.service';
import { Mp3FrameHeaderValidatorService } from '../../services/mp3-frame-header-validator/mp3-frame-header-validator.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { instance, mock } from 'ts-mockito';
import { Repository } from 'typeorm';

describe('FileUploadController', () => {
  let controller: FileUploadController;
  const mockFileRepositpory = mock(Repository<File>);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileUploadController],
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

    controller = module.get<FileUploadController>(FileUploadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
