const SYNC_BITS_MASK = 0xffe00000;
const VERSION_BITS_MASK = 0x00180000;
const LAYER_BITS_MASK = 0x00060000;
const BITRATE_BITS_MASK = 0x0000f000;
const SAMPLING_RATE_BITS_MASK = 0x00000c00;
const CHANNEL_MODE_BITS_MASK = 0x000000c0;
const EMPHASIS_BITS_MASK = 0x00000003;
const PADDING_BIT_MASK = 0x00000200;

const SYNC_BITS_OFFSET = 21;
const VERSION_BITS_OFFSET = 19;
const LAYER_BITS_OFFSET = 17;
const BITRATE_BITS_OFFSET = 12;
const SAMPLE_RATE_BITS_OFFSET = 10;
const PADDING_BIT_OFFSET = 9;
const CHANNEL_MODE_BITS_OFFSET = 6;

const VALID_SYNC_BITS_VALUE = 0x7ff;
const VALID_VERSION_BITS = 0b11;
const VALID_LAYER_BITS = 0b01;
const BITRATE_MAX_VALUE = 0b1111;
const BITRATE_MIN_VALUE = 0b0000;
const VALID_SAMPLING_RATE_BITS = [0b00, 0b01, 0b10];
const VALID_CHANNEL_MODE_BITS = [0b00, 0b01, 0b10, 0b11];
const VALID_EMPHASIS_BITS = [0b00, 0b01, 0b10, 0b11];

export class Mp3FrameHeaderService {
  private readonly header: number;

  constructor(header: Buffer) {
    this.header = header.readUint32BE(0);
  }

  protected get syncBits(): number {
    return (this.header & SYNC_BITS_MASK) >>> SYNC_BITS_OFFSET;
  }

  protected get bitrateBits(): number {
    return (this.header & BITRATE_BITS_MASK) >>> BITRATE_BITS_OFFSET;
  }

  protected get samplingRateBits(): number {
    return (this.header & SAMPLING_RATE_BITS_MASK) >>> SAMPLE_RATE_BITS_OFFSET;
  }

  protected get channelModeBits(): number {
    return (this.header & CHANNEL_MODE_BITS_MASK) >>> CHANNEL_MODE_BITS_OFFSET;
  }

  protected get emphasisBits(): number {
    return this.header & EMPHASIS_BITS_MASK;
  }

  protected get versionBits(): number {
    return (this.header & VERSION_BITS_MASK) >>> VERSION_BITS_OFFSET;
  }

  protected get layerBits(): number {
    return (this.header & LAYER_BITS_MASK) >>> LAYER_BITS_OFFSET;
  }

  protected get paddingBit(): number {
    return (this.header & PADDING_BIT_MASK) >>> PADDING_BIT_OFFSET;
  }

  /**
   * Verifies if the frame header is version 1 layer 3
   * @function
   * @returns {Boolean} returns true if version bits match to 1 and layer bits match to 01, otherwise false
   */
  private isFileMp3Version1Layer3(): boolean {
    return (
      this.versionBits === VALID_VERSION_BITS &&
      this.layerBits === VALID_LAYER_BITS
    );
  }

  /**
   * Verifies the first 15 bits of the header to see if there is a potential match.
   * We count it as a potential match is the first 12 bits match the sync bits and the 13, 14, 15
   * match to version 1 layer 3 as this is what we support for now
   * @function
   * @returns {Boolean} returns true if sync bits are present and the header matches version 1 layer 3, otherwise false
   */
  public isPotentialHeader(): boolean {
    return (
      this.syncBits === VALID_SYNC_BITS_VALUE && this.isFileMp3Version1Layer3()
    );
  }

  /**
   * Verifies the complete header if it's a valid mp3 frame header.
   * It verifies the existence of the sync word, the correct version and layer, the validness of the:
   * bitrange, sample rate bits, channel mode bits and emphasis bits
   * @function
   * @returns {Boolean} returns true if this is a valid mp3 frame header
   */
  public isValidMP3FrameHeader(): boolean {
    if (this.syncBits !== VALID_SYNC_BITS_VALUE) {
      return false;
    }

    if (!this.isFileMp3Version1Layer3()) {
      return false;
    }

    const bitrateBits = this.bitrateBits;
    if (
      bitrateBits === BITRATE_MAX_VALUE ||
      bitrateBits === BITRATE_MIN_VALUE
    ) {
      return false;
    }

    const sampleRateBits = this.samplingRateBits;
    if (!VALID_SAMPLING_RATE_BITS.includes(sampleRateBits)) {
      return false;
    }

    const channelModeBits = this.channelModeBits;
    if (!VALID_CHANNEL_MODE_BITS.includes(channelModeBits)) {
      return false;
    }

    const emphasisBits = this.emphasisBits;
    if (!VALID_EMPHASIS_BITS.includes(emphasisBits)) {
      return false;
    }

    return true;
  }
}
