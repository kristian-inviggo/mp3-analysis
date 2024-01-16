import {
  Controller,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileUploadResponseDto } from '../../dtos/FileUploadResponse.dto';
import { BadRequestResponseDto } from '../../../../exceptions/dtos/BadRequestException.dto';
import { HashFileService } from '../../services/hash-file/hash-file.service';
import { CacheService } from '../../../shared/cache/cache.service';
import { Mp3FrameCounterService } from '../../services/mp3-frame-counter/mp3-frame-counter.service';
import { Request } from 'express';

@ApiTags('file-upload')
@Controller('file-upload')
export class FileUploadController {
  constructor(
    private readonly mp3FrameCounterService: Mp3FrameCounterService,
    private readonly hashFileService: HashFileService,
    private readonly cacheService: CacheService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'only mp3 files are allowed',
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'The number of frames in the mp3 file',
    type: FileUploadResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'When the provided file is missing or of an invalid format',
    type: BadRequestResponseDto,
  })

  /* 
  This validation is left out because sample file is in binary format
  new ParseFilePipeBuilder()
       .addValidator(
         new FileTypeValidator({
           fileTypes: ['audio/mp3', 'audio/mpeg'],
         }),
       )
       .build(), 
  */
  async getMp3FileFrameCount(
    @UploadedFile()
    file: Express.Multer.File,
  ): Promise<FileUploadResponseDto> {
    const fileHash = this.hashFileService.hash(file.buffer);
    const cachedFrameCount = await this.cacheService.getCache<number>(fileHash);

    if (cachedFrameCount) {
      return { frameCount: cachedFrameCount };
    }

    const frameCount = this.mp3FrameCounterService.countFrames(file.buffer);

    await this.cacheService.setCache<number>(fileHash, frameCount);
    return { frameCount };
  }

  @Post('optimized')
  async optimiziedUpload(@Req() req: Request) {
    const count = new Promise<number>((resolve) => {
      let resultNumber = 0;
      let skipXBytes = 0;

      req.on('data', (chunk: Buffer) => {
        const result = this.mp3FrameCounterService.countFramesOptimizied(
          chunk,
          skipXBytes,
        );

        resultNumber += result.frameCount;
        skipXBytes = result.skipBytes;
      });

      req.on('end', () => {
        resolve(resultNumber);
      });
    });

    return await count;
  }
}
