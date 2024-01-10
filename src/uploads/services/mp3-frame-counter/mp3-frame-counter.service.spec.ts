import { Test, TestingModule } from '@nestjs/testing';
import { Mp3FrameCounterService } from './mp3-frame-counter.service';
import * as fs from 'fs';
import * as m from 'music-metadata';
import { Mp3FrameHeaderValidatorService } from '../mp3-frame-header-validator/mp3-frame-header-validator.service';
const mp3Parser = require('mp3-parser');
const XingHeader = require('mp3-header').XingHeader;

describe('Mp3FrameCounterService', () => {
  let service: Mp3FrameCounterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Mp3FrameCounterService, Mp3FrameHeaderValidatorService],
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

  // it.skip('See the metadata from a library to compare it', async () => {
  //   const metadata = await m.parseFile('./test/fixtures/sample.mp3', {
  //     duration: true,
  //   });
  //   console.dir(metadata.format, { depth: 10 });
  // });

  // it.only('See the metadata from a library to compare it v2', async () => {
  //   console.log(mp3Parser);
  //   const buf = fs.readFileSync('./test/fixtures/sample.mp3');
  //   const frames = mp3Parser.readTags(buf);
  //   console.dir(frames.length);
  // });

  // it.only('See the metadata from a library to compare it v3', async () => {
  //   const buf = fs.readFileSync('./test/fixtures/sample.mp3');
  //   var header = new XingHeader(buf);
  //   console.log(header);
  //   if (header.parsed && header.is_valid) {
  //     console.info('Number of audio frames: ', header.xing_frames);
  //   }
  // });
});
