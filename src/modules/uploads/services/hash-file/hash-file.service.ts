import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

type SupportedHashAlgorithms = 'sha256';

@Injectable()
export class HashFileService {
  public hash(
    buffer: Buffer,
    algorithm: SupportedHashAlgorithms = 'sha256',
  ): string {
    const hash = crypto.createHash(algorithm);
    hash.update(buffer);
    return hash.digest('hex');
  }
}
