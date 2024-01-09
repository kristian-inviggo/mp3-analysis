import { Injectable } from '@nestjs/common';

@Injectable()
export class Mp3FrameCounterService {
  private isValidMP3FrameHeader(header: number): boolean {
    // TODO do we need some error handling here? E.g just return invalid file if we encounter an invalid header?
    const syncBits = (header & 0xffe00000) >>> 21; // First 11 bits
    const versionBits = (header & 0x00180000) >>> 19; // Next 2 bits
    const layerBits = (header & 0x00060000) >>> 17; // Next 2 bits
    const bitrateBits = (header & 0x0000f000) >>> 12; // Next 4 bits
    const samplingRateBits = (header & 0x00000c00) >>> 10; // Next 2 bits

    if (syncBits !== 0x7ff) {
      return false; // Sync word must be 11 bits set to '1'
    }

    if (versionBits !== 0b11) {
      return false; // Only MPEG Version 1 is supported
    }

    if (layerBits !== 0b01) {
      return false; // Only Layer III is supported
    }

    if (bitrateBits === 0b1111 || bitrateBits === 0b0000) {
      return false; // Reserved or free bitrate index
    }

    if (![0b00, 0b01, 0b10].includes(samplingRateBits)) {
      return false; // Invalid sampling rate index
    }

    // Add more checks for channel mode, emphasis, etc. if needed

    return true;
  }

  public countFrames(buffer: Buffer): number {
    let frameCount = 0;
    let offset = 0;

    while (offset < buffer.length - 3) {
      if (
        buffer.readUInt8(offset) !== 0xff ||
        (buffer.readUInt8(offset + 1) & 0xe0) !== 0xe0
      ) {
        offset++;
        continue;
      }

      const header = buffer.readUInt32BE(offset);
      const isValidHeader = this.isValidMP3FrameHeader(header);

      if (isValidHeader) {
        frameCount++;
        offset += 4;
      } else {
        offset++;
      }
    }

    return frameCount;
  }
}
