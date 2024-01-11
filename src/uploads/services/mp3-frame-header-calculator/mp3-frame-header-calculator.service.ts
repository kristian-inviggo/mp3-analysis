import { Mp3FrameHeaderService } from '../mp3-frame-header/mp3-frame-header.service';

const bitRatesForMp3Version1Layer3 = [
  0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 0,
] as const;

const sampleRateForMp3Version1Layer3 = 44.1;
const bitsPerSampleForMp3Version1Layer3 = 144;

export class Mp3FrameHeaderCalculatorService extends Mp3FrameHeaderService {
  constructor(header: Buffer) {
    super(header);
  }

  private get bitrate(): number {
    return bitRatesForMp3Version1Layer3[this.bitrateBits];
  }

  public calculateFrameSize(): number {
    return Math.floor(
      (bitsPerSampleForMp3Version1Layer3 * this.bitrate) /
        sampleRateForMp3Version1Layer3 +
        this.paddingBit,
    );
  }
}
