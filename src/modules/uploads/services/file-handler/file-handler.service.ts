import { Injectable } from '@nestjs/common';
import { Mp3FrameCounterService } from '../mp3-frame-counter/mp3-frame-counter.service';
import { CacheService } from '../../../shared/cache/cache.service';
import { HashFileService } from '../hash-file/hash-file.service';

@Injectable()
export class FileHandlerService {
  constructor(
    private readonly mp3FrameCounterService: Mp3FrameCounterService,
    private readonly hashFileService: HashFileService,
    private readonly cacheService: CacheService,
  ) {}

  async getMp3FileFrameCount(buffer: Buffer): Promise<number> {
    const fileHash = this.hashFileService.hash(buffer);
    const cachedNumber = await this.cacheService.getCache<number>(fileHash);

    if (cachedNumber) {
      return cachedNumber;
    }

    const frameCount = this.mp3FrameCounterService.countFrames(buffer);
    await this.cacheService.setCache<number>(fileHash, frameCount);

    return frameCount;
  }
}
