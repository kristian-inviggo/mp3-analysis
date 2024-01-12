import { Module } from '@nestjs/common';
import { UploadsModule } from './modules/uploads/uploads.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configuration } from './config/configuration';
import { LoggerModule } from 'nestjs-pino';
import { HealthModule } from './modules/health/health.module';
import { CacheModule } from '@nestjs/cache-manager';
import { SharedModule } from './modules/shared/shared.module';
import { v4 as uuidv4 } from 'uuid';

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
    CacheModule.register({
      ttl: 60,
      isGlobal: true,
    }),
    UploadsModule,
    HealthModule,
    SharedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
