import {
  Controller,
  ParseFilePipeBuilder,
  Post,
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
import { FileTypeValidator } from '../../validators/FileMimeTypeValidator';

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
          type: 'audio/mpeg',
          format: 'binary',
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
  async getMp3FileFrameCount(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addValidator(
          new FileTypeValidator({
            fileTypes: ['audio/mp3', 'audio/mpeg'],
          }),
        )
        .build(),
    )
    file: Express.Multer.File,
  ): Promise<FileUploadResponseDto> {
    const fileHash = this.hashFileService.hash(file.buffer);
    const cachedFrameCount = await this.cacheService.getCache<number>(fileHash);

    if (cachedFrameCount) {
      return { frameCount: cachedFrameCount };
    }

    const frameCount = await this.mp3FrameCounterService.countFrames(
      file.buffer,
    );

    await this.cacheService.setCache<number>(fileHash, frameCount);
    return { frameCount };
  }
}
