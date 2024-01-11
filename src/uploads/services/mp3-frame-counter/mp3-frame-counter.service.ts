import { Injectable } from '@nestjs/common';
import { Mp3FrameHeaderCalculatorService } from '../mp3-frame-header-calculator/mp3-frame-header-calculator.service';

@Injectable()
export class Mp3FrameCounterService {
  public countFrames(buffer: Buffer): number {
    let frameCount = 0;
    let offset = 0;

    while (offset < buffer.length - 3) {
      const header = buffer.subarray(offset, offset + 4);
      const mp3FrameHeader = new Mp3FrameHeaderCalculatorService(header);

      if (!mp3FrameHeader.isPotentialHeader()) {
        offset++;
        continue;
      }

      if (mp3FrameHeader.isValidMP3FrameHeader()) {
        const frameSize = mp3FrameHeader.calculateFrameSize();

        frameCount++;
        offset += frameSize - 3; // It's suggested that we always check the previous 3 or 4 bytes in case our calculation is off
      } else {
        offset++;
      }
    }

    return frameCount;
  }
}
