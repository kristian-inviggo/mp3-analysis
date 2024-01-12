import { FileValidator } from '@nestjs/common';
import * as fileType from 'file-type-mime';

export interface UploadTypeValidatorOptions {
  fileTypes: string[];
}

export class FileTypeValidator extends FileValidator {
  private _allowedMimeTypes: string[];

  constructor(
    protected readonly validationOptions: UploadTypeValidatorOptions,
  ) {
    super(validationOptions);
    this._allowedMimeTypes = this.validationOptions.fileTypes;
  }

  private isAllowedMimeType(mimeType: string): boolean {
    return this._allowedMimeTypes.includes(mimeType);
  }

  public isValid(file: Express.Multer.File): boolean {
    // multer set's the mimetype dependent on the file's extension
    if (!this.isAllowedMimeType(file.mimetype)) {
      return false;
    }

    const parsedData = fileType.parse(file.buffer.buffer);
    if (!parsedData) {
      return false;
    }
    return this.isAllowedMimeType(parsedData.mime);
  }

  public buildErrorMessage(): string {
    return 'Validation failed (expected type is audio/mpeg)';
  }
}
