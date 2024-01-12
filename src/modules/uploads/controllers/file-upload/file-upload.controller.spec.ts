import { Test, TestingModule } from '@nestjs/testing';
import { FileUploadController } from './file-upload.controller';
import { instance, mock } from 'ts-mockito';
import { readFileSync } from 'fs';
import { Readable } from 'stream';
import { CacheModule } from '@nestjs/cache-manager';
import { FileHandlerService } from '../../services/file-handler/file-handler.service';
import { Mp3FrameCounterService } from '../../services/mp3-frame-counter/mp3-frame-counter.service';
import { HashFileService } from '../../services/hash-file/hash-file.service';
import { CacheService } from '../../../shared/cache/cache.service';

function readFile(fileName: string): Buffer {
  return readFileSync(`test/fixtures/${fileName}`);
}

describe('FileUploadController', () => {
  let controller: FileUploadController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      controllers: [FileUploadController],
      providers: [
        FileHandlerService,
        Mp3FrameCounterService,
        HashFileService,
        CacheService,
      ],
    }).compile();

    controller = module.get<FileUploadController>(FileUploadController);
  });

  describe('POST file-upload', () => {
    const validFile = readFile('sample.mp3');
    const mockReadableStream = mock(Readable);

    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    it('should return the correct frame count', async () => {
      const result = await controller.getMp3FileFrameCount({
        originalname: 'fileName.mp3',
        fieldname: 'form field name',
        mimetype: 'audio/mpeg',
        encoding: '',
        stream: instance(mockReadableStream),
        size: 100,
        destination: 'some destination',
        filename: 'fileName.mp3',
        path: '',
        buffer: validFile,
      });

      expect(result).toEqual({ frameCount: 1610 });
    });
  });
});
