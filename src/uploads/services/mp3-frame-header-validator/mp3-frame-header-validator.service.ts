import { Injectable } from '@nestjs/common';

@Injectable()
export class Mp3FrameHeaderValidatorService {
  private readonly syncBitsMask: number = 0xffe00000;
  private readonly versionBitsMask: number = 0x00180000;
  private readonly layerBitsMask: number = 0x00060000;
  private readonly bitrateBitsMask: number = 0x0000f000;
  private readonly samplingRateBitsMask: number = 0x00000c00;
  private readonly channelModeBitsMask: number = 0x000000c0;
  private readonly emphasisBitsMask: number = 0x00000003;

  private isFileMp3Version1Layer3(header: number): boolean {
    const versionBits = (header & this.versionBitsMask) >>> 19;
    const layerBits = (header & this.layerBitsMask) >>> 17;

    return versionBits === 0b11 && layerBits === 0b01;
  }

  public isPotentialHeader(header: Buffer): boolean {
    return (
      header.readUInt8(0) === 0xff && (header.readUInt8(1) & 0xe0) === 0xe0
    );
  }

  public isValidMP3FrameHeader(headerBytes: Buffer): boolean {
    const header = headerBytes.readUint32BE(0);

    const syncBits = (header & this.syncBitsMask) >>> 21; // First 11 bits
    const bitrateBits = (header & this.bitrateBitsMask) >>> 12; // Next 4 bits
    const samplingRateBits = (header & this.samplingRateBitsMask) >>> 10; // Next 2 bits
    const channelModeBits = (header & this.channelModeBitsMask) >>> 6; // Next 2 bits
    const emphasisBits = header & this.emphasisBitsMask; // Last 2 bits

    if (syncBits !== 0x7ff) {
      return false; // Sync word must be 11 bits set to '1'
    }

    if (!this.isFileMp3Version1Layer3(header)) {
      return false;
    }

    if (bitrateBits === 0b1111 || bitrateBits === 0b0000) {
      return false; // Reserved or free bitrate index
    }

    if (![0b00, 0b01, 0b10].includes(samplingRateBits)) {
      return false; // Invalid sampling rate index
    }

    if (![0b00, 0b01, 0b10, 0b11].includes(channelModeBits)) {
      return false; // Invalid channel mode index
    }

    if (![0b00, 0b01, 0b10, 0b11].includes(emphasisBits)) {
      return false; // Invalid emphasis index
    }

    return true;
  }
}
