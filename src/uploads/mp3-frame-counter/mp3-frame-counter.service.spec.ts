import { Test, TestingModule } from '@nestjs/testing';
import { Mp3FrameCounterService } from './mp3-frame-counter.service';
import * as fs from 'fs';
import * as m from 'music-metadata';

describe('Mp3FrameCounterService', () => {
  let service: Mp3FrameCounterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Mp3FrameCounterService],
    }).compile();

    service = module.get<Mp3FrameCounterService>(Mp3FrameCounterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return number of frames', () => {
    expect(
      service.countFrames(fs.readFileSync('./test/fixtures/sample.mp3')),
    ).toBe(1792);
  });

  it.only('See the metadata from a library to compare it', async () => {
    const metadata = await m.parseFile('./test/fixtures/sample.mp3');
    console.dir(metadata, { depth: 10 });
  });
});
