import { Injectable } from '@nestjs/common';
import { Mp3FrameCounterService } from '../mp3-frame-counter/mp3-frame-counter.service';

@Injectable()
export class FileHandlerService {
  constructor(
    private readonly mp3FrameCounterService: Mp3FrameCounterService,
  ) {}

  async getMp3FileFrameCount(buffer: Buffer): Promise<number> {
    return this.mp3FrameCounterService.countFrames(buffer);
  }
}
