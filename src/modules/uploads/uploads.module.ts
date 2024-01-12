import { Module } from '@nestjs/common';
import { HashFileService } from './services/hash-file/hash-file.service';
import { FileUploadController } from './controllers/file-upload/file-upload.controller';
import { Mp3FrameCounterService } from './services/mp3-frame-counter/mp3-frame-counter.service';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [FileUploadController],
  providers: [Mp3FrameCounterService, HashFileService],
})
export class UploadsModule {}
