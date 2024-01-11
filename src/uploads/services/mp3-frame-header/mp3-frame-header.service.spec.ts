import { Mp3FrameHeader } from './mp3-frame-header.service';

describe('Mp3FrameHeaderValidatorService', () => {
  describe('isPotentialHeader', () => {
    it('should return true for a valid MP3 header', () => {
      const validHeader = Buffer.from([0xff, 0xfa, 0x00, 0x00]);
      const service = new Mp3FrameHeader(validHeader);

      const result = service.isPotentialHeader();
      expect(result).toBe(true);
    });

    it('should return false for an invalid MP3 header', () => {
      const invalidHeader = Buffer.from([0x00, 0xff, 0x00, 0x00]);
      const service = new Mp3FrameHeader(invalidHeader);

      const result = service.isPotentialHeader();
      expect(result).toBe(false);
    });
  });

  describe('isValidMP3FrameHeader', () => {
    describe('should return true for valid header', () => {
      it('for a valid MP3 frame header', () => {
        const validHeaders: Buffer[] = [
          Buffer.from([0xff, 0xfa, 0xa0, 0x00]),
          Buffer.from([0xff, 0xfa, 0xa4, 0x41]),
        ];

        validHeaders.forEach((header) => {
          const service = new Mp3FrameHeader(header);
          const result = service.isValidMP3FrameHeader();
          expect(result).toBe(true);
        });
      });
    });

    describe('should return false for invalid header', () => {
      it('for invalid MP3 frame header with incorrect sync bits', () => {
        const invalidHeader = Buffer.from([0x00, 0xff, 0x00, 0x00]);
        const service = new Mp3FrameHeader(invalidHeader);

        const result = service.isValidMP3FrameHeader();
        expect(result).toBe(false);
      });

      it('for invalid MP3 frame header with incorrect version and layer', () => {
        const invalidHeader = Buffer.from([0xff, 0x00, 0x00, 0x00]);
        const service = new Mp3FrameHeader(invalidHeader);
        const result = service.isValidMP3FrameHeader();
        expect(result).toBe(false);
      });

      it('for invalid MP3 frame header with incorrect bitrate', () => {
        const headers: Buffer[] = [
          Buffer.from([0xff, 0xfa, 0xf0, 0x00]),
          Buffer.from([0xff, 0xfa, 0x00, 0x00]),
        ];

        headers.forEach((header) => {
          const service = new Mp3FrameHeader(header);
          const result = service.isValidMP3FrameHeader();
          expect(result).toBe(false);
        });
      });

      it('for invalid MP3 frame header with incorrect frequency (sample rate)', () => {
        const header = Buffer.from([0xff, 0xfa, 0xfc, 0x00]);
        const service = new Mp3FrameHeader(header);

        const result = service.isValidMP3FrameHeader();
        expect(result).toBe(false);
      });

      it('for invalid MP3 frame header with incorrect channel mode', () => {
        const header = Buffer.from([0xff, 0xfa, 0xfc, 0x00]);
        const service = new Mp3FrameHeader(header);

        const result = service.isValidMP3FrameHeader();
        expect(result).toBe(false);
      });

      it('for invalid MP3 frame header with incorrect emphasis', () => {
        const header = Buffer.from([0xff, 0xfa, 0xfc, 0x00]);
        const service = new Mp3FrameHeader(header);

        const result = service.isValidMP3FrameHeader();
        expect(result).toBe(false);
      });
    });
  });
});
