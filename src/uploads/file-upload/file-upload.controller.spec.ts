import { Test, TestingModule } from '@nestjs/testing';
import { FileUploadController } from './file-upload.controller';
import { Mp3FrameCounterService } from '../mp3-frame-counter/mp3-frame-counter.service';

describe('FileUploadController', () => {
  let controller: FileUploadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileUploadController],
      providers: [Mp3FrameCounterService],
    }).compile();

    controller = module.get<FileUploadController>(FileUploadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
