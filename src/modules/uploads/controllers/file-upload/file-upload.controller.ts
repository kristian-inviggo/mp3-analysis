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

@Controller('file-upload')
export class FileUploadController {
  constructor(private readonly fileHandlerService: FileHandlerService) {}

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
  async uploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'audio/mpeg',
        })
        .build(),
    )
    file: Express.Multer.File,
  ): Promise<FileUploadResponseDto> {
    const frameCount =
      await this.fileHandlerService.validateAndGetMp3FileFrames(file.buffer);
    return { frameCount };
  }
}
