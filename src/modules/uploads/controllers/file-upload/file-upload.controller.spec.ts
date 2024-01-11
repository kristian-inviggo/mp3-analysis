import { Test, TestingModule } from '@nestjs/testing';
import { FileUploadController } from './file-upload.controller';
import { FileHandlerService } from '../../services/file-handler/file-handler.service';
import { Mp3FrameCounterService } from '../../services/mp3-frame-counter/mp3-frame-counter.service';
import { HashFileService } from '../../services/hash-file/hash-file.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { anything, instance, mock, resetCalls, verify, when } from 'ts-mockito';
import { Repository } from 'typeorm';
import { readFileSync } from 'fs';
import { Readable } from 'stream';

function readFile(fileName: string): Buffer {
  return readFileSync(`test/fixtures/${fileName}`);
}

describe('FileUploadController', () => {
  let controller: FileUploadController;
  const mockFileRepositpory = mock(Repository<File>);

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileUploadController],
      providers: [
        FileHandlerService,
        Mp3FrameCounterService,
        HashFileService,
        {
          provide: getRepositoryToken(File),
          useValue: instance(mockFileRepositpory),
        },
      ],
    }).compile();

    controller = module.get<FileUploadController>(FileUploadController);
  });

  beforeEach(() => {
    resetCalls(mockFileRepositpory);
  });

  describe('POST api/v1/file-upload', () => {
    const validFile = readFile('sample.mp3');
    const mockReadableStream = mock(Readable);

    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    it('should verify that the save method was invoked for saving a file when there is no file with that hash in the database', async () => {
      when(mockFileRepositpory.findOneBy(anything())).thenResolve(null);

      const result = await controller.uploadFile({
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

      verify(mockFileRepositpory.save(anything())).once();
    });

    it("should not insert the new frameCount to the database if there is an entry for the file's hash", async () => {
      when(mockFileRepositpory.findOneBy(anything())).thenResolve({
        id: 'some id',
        frameCount: 500,
      });

      const result = await controller.uploadFile({
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

      expect(result).toEqual({ frameCount: 500 });

      verify(mockFileRepositpory.save(anything())).never();
    });
  });
});
