import {
  Controller,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseInterceptors,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { Mp3FrameCounterService } from '../mp3-frame-counter/mp3-frame-counter.service';

@Controller('file-upload')
export class FileUploadController {
  constructor(
    private readonly mp3FrameCounterService: Mp3FrameCounterService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'audio/mpeg',
        })
        .build(),
    )
    file: Express.Multer.File,
    @Res() response: Response,
  ) {
    const frameCount = this.mp3FrameCounterService.countFrames(file);

    return response.status(HttpStatus.CREATED).json({ frameCount });
  }
}
