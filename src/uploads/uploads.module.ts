import { Module } from '@nestjs/common';
import { FileUploadController } from './file-upload/file-upload.controller';
import { Mp3FrameCounterService } from './mp3-frame-counter/mp3-frame-counter.service';
import { Mp3FrameHeaderValidatorService } from './mp3-frame-header-validator/mp3-frame-header-validator.service';

@Module({
  controllers: [FileUploadController],
  providers: [Mp3FrameCounterService, Mp3FrameHeaderValidatorService],
})
export class UploadsModule {}
