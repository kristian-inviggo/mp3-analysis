import { Injectable } from '@nestjs/common';
import { Mp3FrameHeaderCalculator } from '../mp3-frame-header/mp3-frame-header.service';

@Injectable()
export class Mp3FrameCounterService {
  public countFrames(buffer: Buffer): number {
    let frameCount = 0;
    let offset = 0;

    while (offset < buffer.length - 3) {
      const header = buffer.subarray(offset, offset + 4);
      const mp3FrameHeader = new Mp3FrameHeaderCalculator(header);

      if (!mp3FrameHeader.isPotentialHeader()) {
        offset++;
        continue;
      }

      if (mp3FrameHeader.isValidMP3FrameHeader()) {
        const frameSize = mp3FrameHeader.calculateFrameSize();

        frameCount++;
        offset += frameSize - 3;
      } else {
        offset++;
      }
    }

    return frameCount;
  }
}
