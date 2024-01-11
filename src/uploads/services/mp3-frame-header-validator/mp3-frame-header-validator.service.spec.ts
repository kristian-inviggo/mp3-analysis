import { Test, TestingModule } from '@nestjs/testing';
import { Mp3FrameHeaderValidatorService } from './mp3-frame-header-validator.service';

describe('Mp3FrameHeaderValidatorService', () => {
  let service: Mp3FrameHeaderValidatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Mp3FrameHeaderValidatorService],
    }).compile();

    service = module.get<Mp3FrameHeaderValidatorService>(
      Mp3FrameHeaderValidatorService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('isPotentialHeader', () => {
    it('should return true for a valid MP3 header', () => {
      const validHeader = Buffer.from([0xff, 0xe1, 0x00, 0x00]);
      const result = service.isPotentialHeader(validHeader);
      expect(result).toBe(true);
    });

    it('should return false for an invalid MP3 header', () => {
      const invalidHeader = Buffer.from([0x00, 0xff, 0x00, 0x00]);
      const result = service.isPotentialHeader(invalidHeader);
      expect(result).toBe(false);
    });
  });

  describe('isValidMP3FrameHeader', () => {
    describe('should return true for valid header', () => {
      it('for a valid MP3 frame header', () => {
        const validHeader = Buffer.from([0xff, 0xfa, 0xa0, 0x00]);
        const result = service.isValidMP3FrameHeader(validHeader);
        expect(result).toBe(true);
      });
    });

    describe('should return false for invalid header', () => {
      it('for invalid MP3 frame header with incorrect sync bits', () => {
        const invalidHeader = Buffer.from([0x00, 0xff, 0x00, 0x00]);
        const result = service.isValidMP3FrameHeader(invalidHeader);
        expect(result).toBe(false);
      });

      it('for invalid MP3 frame header with incorrect version and layer', () => {
        const invalidHeader = Buffer.from([0xff, 0xff, 0x00, 0x00]);
        const result = service.isValidMP3FrameHeader(invalidHeader);
        expect(result).toBe(false);
      });
    });
  });
});
