import { Module } from '@nestjs/common';
import { FileUploadController } from './file-upload/file-upload.controller';
import { Mp3FrameCounterService } from './mp3-frame-counter/mp3-frame-counter.service';

@Module({
  controllers: [FileUploadController],
  providers: [Mp3FrameCounterService],
})
export class UploadsModule {}
