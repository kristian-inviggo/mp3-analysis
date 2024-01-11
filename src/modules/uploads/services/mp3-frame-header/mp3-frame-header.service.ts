const syncBitsMask = 0xffe00000;
const versionBitsMask = 0x00180000;
const layerBitsMask = 0x00060000;
const bitrateBitsMask = 0x0000f000;
const samplingRateBitsMask = 0x00000c00;
const channelModeBitsMask = 0x000000c0;
const emphasisBitsMask = 0x00000003;
const paddingBitMask = 0x00000200;

const syncBitsOffset = 21;
const versionBitsOffset = 19;
const layerBitsOffset = 17;
const bitRateBitsOffset = 12;
const sampleRateBitsOffset = 10;
const paddingBitOffset = 9;
const channelModeBitsOffset = 6;

const validSyncBitsValue = 0x7ff;
const validVersionBits = 0b11;
const validLayerBits = 0b01;
const bitrateMaxValue = 0b1111;
const bitrateMinValue = 0b0000;
const samplingRateBitsValidValues = [0b00, 0b01, 0b10] as const;
const validChannelModeBits = [0b00, 0b01, 0b10, 0b11] as const;
const validEmphasisBits = [0b00, 0b01, 0b10, 0b11] as const;

export class Mp3FrameHeaderService {
  private readonly header: number;

  constructor(header: Buffer) {
    this.header = header.readUint32BE(0);
  }

  protected get syncBits(): number {
    return (this.header & syncBitsMask) >>> syncBitsOffset;
  }

  protected get bitrateBits(): number {
    return (this.header & bitrateBitsMask) >>> bitRateBitsOffset;
  }

  protected get samplingRateBits(): number {
    return (this.header & samplingRateBitsMask) >>> sampleRateBitsOffset;
  }

  protected get channelModeBits(): number {
    return (this.header & channelModeBitsMask) >>> channelModeBitsOffset;
  }

  protected get emphasisBits(): number {
    return this.header & emphasisBitsMask;
  }

  protected get versionBits(): number {
    return (this.header & versionBitsMask) >>> versionBitsOffset;
  }

  protected get layerBits(): number {
    return (this.header & layerBitsMask) >>> layerBitsOffset;
  }

  protected get paddingBit(): number {
    return (this.header & paddingBitMask) >>> paddingBitOffset;
  }

  private isFileMp3Version1Layer3(): boolean {
    return (
      this.versionBits === validVersionBits && this.layerBits === validLayerBits
    );
  }

  public isPotentialHeader(): boolean {
    return (
      this.syncBits === validSyncBitsValue && this.isFileMp3Version1Layer3()
    );
  }

  public isValidMP3FrameHeader(): boolean {
    if (this.syncBits !== validSyncBitsValue) {
      return false;
    }

    if (!this.isFileMp3Version1Layer3()) {
      return false;
    }

    const bitrateBits = this.bitrateBits;
    if (bitrateBits === bitrateMaxValue || bitrateBits === bitrateMinValue) {
      return false;
    }

    const sampleRateBits = this.samplingRateBits;
    if (
      !(samplingRateBitsValidValues as unknown as number[]).includes(
        sampleRateBits,
      )
    ) {
      return false;
    }

    const channelModeBits = this.channelModeBits;
    if (
      !(validChannelModeBits as unknown as number[]).includes(channelModeBits)
    ) {
      return false;
    }

    const emphasisBits = this.emphasisBits;
    if (!(validEmphasisBits as unknown as number[]).includes(emphasisBits)) {
      return false;
    }

    return true;
  }
}
