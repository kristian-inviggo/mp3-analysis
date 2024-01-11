import { Module } from '@nestjs/common';
import { UploadsModule } from './uploads/uploads.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configuration } from '../config/configuration';
import { LoggerModule } from 'nestjs-pino';
import { HealthModule } from './health/health.module';
const { v4: uuidv4 } = require('uuid');

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/config/env/${process.env.NODE_ENV}.env`,
      load: [configuration],
      isGlobal: true,
    }),
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          pinoHttp: {
            enabled: !!configService.get<boolean>('logging'),
            level: 'info',
            genReqId: (request) =>
              request.headers['x-correlation-id'] || uuidv4(),
          },
        };
      },
    }),
    UploadsModule,
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
