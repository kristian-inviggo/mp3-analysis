import { Module } from '@nestjs/common';
import { UploadsModule } from './uploads/uploads.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './uploads/entities/file.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'mp3Analytics',
      entities: [File],
      synchronize: true,
    }),
    UploadsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
