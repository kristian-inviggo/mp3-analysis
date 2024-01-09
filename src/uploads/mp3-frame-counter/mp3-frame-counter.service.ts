import { Injectable } from '@nestjs/common';
import { Mp3FrameHeaderValidatorService } from '../mp3-frame-header-validator/mp3-frame-header-validator.service';

@Injectable()
export class Mp3FrameCounterService {
  constructor(
    private readonly mp3FrameHeaderValidator: Mp3FrameHeaderValidatorService,
  ) {}

  public countFrames(buffer: Buffer): number {
    let frameCount = 0;
    let offset = 0;

    while (offset < buffer.length - 3) {
      const header = buffer.subarray(offset, offset + 4);

      if (!this.mp3FrameHeaderValidator.isPotentialHeader(header)) {
        offset++;
        continue;
      }

      if (this.mp3FrameHeaderValidator.isValidMP3FrameHeader(header)) {
        frameCount++;
        offset += 4;
      } else {
        offset++;
      }
    }

    return frameCount;
  }
}
