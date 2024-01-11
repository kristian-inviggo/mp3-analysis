import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import * as request from 'supertest';
import * as dotenv from 'dotenv';
import { DatabaseEnvironment } from '../../src/config/interfaces/DatabaseEnvironment';
import { PostgresTestContainer } from './postgres-testcontainer';
import { INestApplication } from '@nestjs/common';
import { instance, mock, when } from 'ts-mockito';
import TestAgent from 'supertest/lib/agent';
import * as path from 'path';
import { DataSource } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';

dotenv.config({
  path: path.resolve(__dirname, '../../src/config/env/e2e.env'),
});

export class TestApplicationStarter {
  private readonly postgresTestContainer = new PostgresTestContainer();
  private app: INestApplication;
  private dataSource: DataSource;

  private getDatabaseEnvironmentVariables(): DatabaseEnvironment {
    return {
      host: process.env.DB_HOST || 'localhost',
      name: process.env.DB_NAME!,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5433,
      username: process.env.DB_USERNAME!,
      password: process.env.DB_PASSWORD!,
    };
  }

  public async init(): Promise<void> {
    await this.postgresTestContainer.init(
      this.getDatabaseEnvironmentVariables(),
    );
    const mockConfigService = mock(ConfigService);

    const dbConfig = {
      ...this.getDatabaseEnvironmentVariables(),
      port: this.postgresTestContainer.port,
    };

    when(mockConfigService.get('database')).thenReturn(dbConfig);

    when(mockConfigService.get('logging')).thenReturn(false);
    when(mockConfigService.get('NODE_ENV')).thenReturn('test');

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: dbConfig.host,
          port: dbConfig.port,
          username: dbConfig.username,
          password: dbConfig.password,
          database: dbConfig.name,
          entities: [File],
          synchronize: true,
        }),
        AppModule,
      ],
    })
      .overrideProvider(ConfigService)
      .useValue(instance(mockConfigService))
      .compile();

    this.app = moduleFixture.createNestApplication();
    await this.app.init();
  }

  public async stop(): Promise<void> {
    await this.app.close();
    await this.postgresTestContainer.stop();
  }

  get request(): TestAgent {
    return request(this.app.getHttpServer());
  }
}