import { Injectable } from '@nestjs/common';
import { Mp3FrameCounterService } from '../mp3-frame-counter/mp3-frame-counter.service';
import { HashFileService } from '../hash-file/hash-file.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from '../../entities/file.entity';

@Injectable()
export class FileHandlerService {
  constructor(
    private readonly mp3FrameCounterService: Mp3FrameCounterService,
    private readonly hashService: HashFileService,
    @InjectRepository(File)
    private filesRepository: Repository<File>,
  ) {}

  async validateAndGetMp3FileFrames(buffer: Buffer): Promise<number> {
    const hash = this.hashService.hash(buffer);
    const file = await this.filesRepository.findOneBy({ id: hash });

    if (file) {
      return file.frameCount;
    }

    const frameCount = this.mp3FrameCounterService.countFrames(buffer);
    await this.filesRepository.save({ id: hash, frameCount });

    return frameCount;
  }
}
