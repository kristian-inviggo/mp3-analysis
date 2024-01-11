import { Mp3FrameHeaderCalculatorService } from './mp3-frame-header-calculator.service';

interface TestMocksWithExpectations {
  header: Buffer;
  expectedResult: number;
}

describe('Mp3FrameHeaderCalculatorService', () => {
  describe('isPotentialHeader', () => {
    it('should return true for a valid MP3 header', () => {
      const resultsWithBuffer: TestMocksWithExpectations[] = [
        {
          header: Buffer.from([0xff, 0xfb, 0x90, 0x64]),
          expectedResult: 417,
        },
        {
          header: Buffer.from([0xff, 0xfb, 0xa0, 0x44]),
          expectedResult: 522,
        },
        {
          header: Buffer.from([0xff, 0xfb, 0x80, 0x64]),
          expectedResult: 365,
        },
      ];

      resultsWithBuffer.forEach(({ header, expectedResult }) => {
        const service = new Mp3FrameHeaderCalculatorService(header);
        const result = service.calculateFrameSize();

        expect(result).toBe(expectedResult);
      });
    });
  });
});
