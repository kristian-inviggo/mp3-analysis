import {
  Controller,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadResponseDto } from '../../interfaces/FileUploadResponse';
import { FileHandlerService } from '../../services/file-handler/file-handler.service';

@Controller('file-upload')
export class FileUploadController {
  constructor(private readonly fileHandlerService: FileHandlerService) {}

  @Post()
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
    const frameCount = await this.fileHandlerService.handleFile(file.buffer);
    return { frameCount };
  }
}
