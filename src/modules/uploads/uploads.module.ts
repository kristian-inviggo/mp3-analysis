import { Module } from '@nestjs/common';
import { HashFileService } from './services/hash-file/hash-file.service';
import { FileHandlerService } from './services/file-handler/file-handler.service';
import { FileUploadController } from './controllers/file-upload/file-upload.controller';
import { Mp3FrameCounterService } from './services/mp3-frame-counter/mp3-frame-counter.service';

@Module({
  controllers: [FileUploadController],
  providers: [Mp3FrameCounterService, HashFileService, FileHandlerService],
})
export class UploadsModule {}
