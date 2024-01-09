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

  public isPotentialHeader(header: Buffer): boolean {
    return (
      header.readUInt8(0) === 0xff && (header.readUInt8(1) & 0xe0) === 0xe0
    );
  }

  public isValidMP3FrameHeader(headerBytes: Buffer): boolean {
    const header = headerBytes.readUint32BE(0);

    // TODO do we need some error handling here? E.g just return invalid file if we encounter an invalid header?
    const syncBits = (header & this.syncBitsMask) >>> 21; // First 11 bits
    const versionBits = (header & this.versionBitsMask) >>> 19; // Next 2 bits
    const layerBits = (header & this.layerBitsMask) >>> 17; // Next 2 bits
    const bitrateBits = (header & this.bitrateBitsMask) >>> 12; // Next 4 bits
    const samplingRateBits = (header & this.samplingRateBitsMask) >>> 10; // Next 2 bits
    const channelModeBits = (header & this.channelModeBitsMask) >>> 6; // Next 2 bits
    const emphasisBits = header & this.emphasisBitsMask; // Last 2 bits

    if (syncBits !== 0x7ff) {
      return false; // Sync word must be 11 bits set to '1'
    }

    if (versionBits !== 0b11) {
      // TODO should I throw an exception here?
      return false; // Only MPEG Version 1 is supported
    }

    if (layerBits !== 0b01) {
      // TODO should I throw an exception here?
      return false; // Only Layer III is supported
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

  //   private readXingFrameCount(buffer: Buffer): number | null {
  //     // Check for the presence of the Xing header
  //     const xingHeaderIdentifier = buffer.toString('utf-8', 36, 40); // Xing or Info
  //     if (xingHeaderIdentifier !== 'Xing' && xingHeaderIdentifier !== 'Info') {
  //       return null; // No Xing header found
  //     }

  //     // Read the frame count from the Xing header
  //     const frameCountOffset = 120; // Offset for the frame count field
  //     const frameCount = buffer.readUInt32BE(frameCountOffset);

  //     return frameCount;
  //   }
}
