import { Module } from '@nestjs/common';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [UploadsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
