import {
  Controller,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileHandlerService } from '../../services/file-handler/file-handler.service';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { FileUploadResponseDto } from '../../dtos/FileUploadResponse.dto';
import { BadRequestResponseDto } from '../../../../exceptions/dtos/BadRequestException.dto';
import { HashFileService } from '../../services/hash-file/hash-file.service';
import { CacheService } from '../../../shared/cache/cache.service';

@Controller('file-upload')
export class FileUploadController {
  constructor(
    private readonly fileHandlerService: FileHandlerService,
    private readonly hashFileService: HashFileService,
    private readonly cacheService: CacheService,
  ) {}

  @Post()
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
  @UseInterceptors(FileInterceptor('file'))
  async getMp3FileFrameCount(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'audio/mpeg',
        })
        .build(),
    )
    file: Express.Multer.File,
  ): Promise<FileUploadResponseDto> {
    const fileHash = this.hashFileService.hash(file.buffer);
    const cachedFrameCount = await this.cacheService.getCache<number>(fileHash);

    if (cachedFrameCount) {
      return { frameCount: cachedFrameCount };
    }

    const frameCount = await this.fileHandlerService.getMp3FileFrameCount(
      file.buffer,
    );

    await this.cacheService.setCache<number>(fileHash, frameCount);
    return { frameCount };
  }
}
