import { Module } from '@nestjs/common';
import { UploadsModule } from './uploads/uploads.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { File } from './uploads/entities/file.entity';
import { configuration } from './config/configuration';
import { DatabaseEnvironment } from './config/interfaces/DatabaseEnvironment';
import { LoggerModule } from 'nestjs-pino';
const { v4: uuidv4 } = require('uuid');

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/config/env/${process.env.NODE_ENV}.env`,
      load: [configuration],
      isGlobal: true,
    }),
    LoggerModule.forRootAsync({
      useFactory: async () => {
        return {
          pinoHttp: {
            level: 'info',
            genReqId: (request) =>
              request.headers['x-correlation-id'] || uuidv4(),
          },
        };
      },
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseConfiguration =
          configService.get<DatabaseEnvironment>('database')!;

        return {
          type: 'postgres',
          host: databaseConfiguration.host,
          port: databaseConfiguration.port,
          username: databaseConfiguration.username,
          password: databaseConfiguration.password,
          database: databaseConfiguration.name,
          entities: [File],
          synchronize: false, //  TODO remove this for production purposes
        };
      },
    }),
    UploadsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
