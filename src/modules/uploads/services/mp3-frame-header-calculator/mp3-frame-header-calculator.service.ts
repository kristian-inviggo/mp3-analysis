import { Mp3FrameHeaderService } from '../mp3-frame-header/mp3-frame-header.service';

const BITRATES_FOR_MP3_VERSION1_LAYER3 = [
  0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 0,
] as const;

const SAMPLE_RATE_FOR_MP3_VERSION1_LAYER3 = 44.1;
const BITS_PER_SAMPLE_FOR_MP3_VERSION1_LAYER3 = 144;

export class Mp3FrameHeaderCalculatorService extends Mp3FrameHeaderService {
  constructor(header: Buffer) {
    super(header);
  }

  private get bitrate(): number {
    return BITRATES_FOR_MP3_VERSION1_LAYER3[this.bitrateBits];
  }

  /**
   * Calculates the frame size using the standard values for mp3 version 1 layer 3.
   * @function
   * @returns {Number} returns the calculated frame size in bytes
   */

  public calculateFrameSize(): number {
    return Math.floor(
      (BITS_PER_SAMPLE_FOR_MP3_VERSION1_LAYER3 * this.bitrate) /
        SAMPLE_RATE_FOR_MP3_VERSION1_LAYER3 +
        this.paddingBit,
    );
  }
}
